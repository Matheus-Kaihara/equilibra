import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase-client";

const RATE_LIMIT_RECOVERY_MESSAGE = "Muitas tentativas. Aguarde 60 segundos e tente novamente.";
const GENERIC_RECOVERY_ERROR_MESSAGE = "Não foi possível validar o link de recuperação.";

function getRecoveryErrorMessage(errorMessage?: string) {
  if ((errorMessage ?? "").toLowerCase().includes("rate limit exceeded")) {
    return RATE_LIMIT_RECOVERY_MESSAGE;
  }

  return GENERIC_RECOVERY_ERROR_MESSAGE;
}

function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenReady, setTokenReady] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validatingLink, setValidatingLink] = useState(true);
  const [linkError, setLinkError] = useState<string | null>(null);

  const tokenHash = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("token_hash");
  }, [location.search]);

  useEffect(() => {
    const validateRecoveryLink = async () => {
      setValidatingLink(true);
      setLinkError(null);

      try {
        if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({
            type: "recovery",
            token_hash: tokenHash,
          });

          if (error) {
            const recoveryErrorMessage = getRecoveryErrorMessage(error.message);
            setLinkError(recoveryErrorMessage);
            toast.error(recoveryErrorMessage);
            return;
          }

          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setLinkError("Abra o link recebido por e-mail para redefinir sua senha.");
        }
      } catch (error) {
        setLinkError(GENERIC_RECOVERY_ERROR_MESSAGE);
      } finally {
        setValidatingLink(false);
      }
    };

    void validateRecoveryLink();
  }, [tokenHash]);

  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (!tokenHash || type !== "recovery") {
      setTokenError("Link de recuperação inválido ou expirado");
      return;
    }

    const verifyRecoveryToken = async () => {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });

      if (error) {
        setTokenError(getRecoveryErrorMessage(error.message));
        return;
      }

      setTokenReady(true);
    };

    verifyRecoveryToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (linkError) {
      toast.error(linkError);
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        toast.error(error.message || "Erro ao redefinir senha");
        return;
      }

      toast.success("Senha redefinida com sucesso!");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card p-8 rounded-2xl border border-border shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl mb-2 text-white">Redefinir senha</h1>
            <p className="text-muted-foreground">
              Digite e confirme sua nova senha para concluir a recuperação
            </p>
          </div>

          {linkError && (
            <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{linkError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="newPassword" className="block mb-2 text-sm text-white">
                Nova senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-accent text-white rounded-lg border border-border placeholder:text-zinc-300 focus:border-violet-500 focus:outline-none transition-colors"
                  required
                  disabled={loading || validatingLink || Boolean(linkError)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm text-white">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-accent text-white rounded-lg border border-border placeholder:text-zinc-300 focus:border-violet-500 focus:outline-none transition-colors"
                  required
                  disabled={loading || validatingLink || Boolean(linkError)}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || validatingLink || Boolean(linkError)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {validatingLink ? "Validando link..." : loading ? "Salvando..." : "Salvar nova senha"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export function ResetPassword() {
  return <ResetPasswordForm />;
}
