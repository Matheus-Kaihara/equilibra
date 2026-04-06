import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { supabase } from "../lib/supabase-client";

interface User {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresMFA?: boolean }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  enrollMFA: () => Promise<{ success: boolean; qrCode?: string; secret?: string; error?: string }>;
  verifyMFA: (code: string) => Promise<{ success: boolean; error?: string }>;
  challengeMFA: (code: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getPasswordResetRedirectUrl = () => {
  const fallbackUrl = `${window.location.origin}/#/reset-password`;
  const appUrl = import.meta.env.PROD ? import.meta.env.VITE_APP_URL_PROD : import.meta.env.VITE_APP_URL_DEV;

  if (!appUrl) {
    return fallbackUrl;
  }

  try {
    const normalizedAppUrl = new URL(appUrl).toString().replace(/\/+$/, "");
    return `${normalizedAppUrl}/#/reset-password`;
  } catch {
    console.warn("VITE_APP_URL inválida. Usando fallback seguro para redirectTo.");
    return fallbackUrl;
  }
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão existente
    checkSession();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as User);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user as User);
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Verificar se é erro de MFA
        if (error.message.includes("MFA") || error.message.includes("factor")) {
          return { success: false, requiresMFA: true };
        }
        return { success: false, error: error.message };
      }

      if (data.session?.user) {
        setUser(data.session.user as User);
        return { success: true };
      }

      if (data.user && !data.session) {
        return {
          success: false,
          error: "Conta sem sessão ativa. Verifique o e-mail de confirmação ou tente novamente.",
        };
      }

      return { success: false, error: "Erro ao fazer login" };
    } catch (error: any) {
      console.error("Erro no login:", error);
      return { success: false, error: error.message || "Erro ao fazer login" };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fc8ebc49/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Erro ao criar conta" };
      }

      return { success: true };
    } catch (error: any) {
      console.error("Erro no signup:", error);
      return { success: false, error: error.message || "Erro ao criar conta" };
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getPasswordResetRedirectUrl(),
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      return { success: false, error: error.message || "Erro ao solicitar redefinição de senha" };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      return { success: false, error: error.message || "Erro ao atualizar senha" };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getAccessToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error("Erro ao obter token:", error);
      return null;
    }
  };

  const enrollMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Equilibra 2FA",
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      };
    } catch (error: any) {
      console.error("Erro ao configurar 2FA:", error);
      return { success: false, error: error.message || "Erro ao configurar 2FA" };
    }
  };

  const verifyMFA = async (code: string) => {
    try {
      const factors = await supabase.auth.mfa.listFactors();
      
      if (factors.error) {
        return { success: false, error: factors.error.message };
      }

      const totpFactor = factors.data.totp[0];

      if (!totpFactor) {
        return { success: false, error: "Nenhum fator 2FA encontrado" };
      }

      // É obrigatório criar um challenge antes de verificar
      const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });

      if (challenge.error) {
        return { success: false, error: challenge.error.message };
      }

      const { data, error } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao verificar 2FA:", error);
      return { success: false, error: error.message || "Erro ao verificar código" };
    }
  };

  const challengeMFA = async (code: string) => {
    try {
      const factors = await supabase.auth.mfa.listFactors();
      
      if (factors.error) {
        return { success: false, error: factors.error.message };
      }

      const totpFactor = factors.data.totp[0];

      if (!totpFactor) {
        return { success: false, error: "2FA não configurado" };
      }

      const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });

      if (challenge.error) {
        return { success: false, error: challenge.error.message };
      }

      const { data, error } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      setUser(data.user as User);
      return { success: true };
    } catch (error: any) {
      console.error("Erro no desafio 2FA:", error);
      return { success: false, error: error.message || "Erro ao verificar código" };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    requestPasswordReset,
    updatePassword,
    signOut,
    getAccessToken,
    enrollMFA,
    verifyMFA,
    challengeMFA,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
