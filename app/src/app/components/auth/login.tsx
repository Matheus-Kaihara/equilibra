import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Lock, Mail, Shield } from "lucide-react";
import { Toaster, toast } from "sonner";
import { AuthProvider, useAuth } from "../../contexts/auth-context";

function LoginForm() {
  const { signIn, challengeMFA } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        toast.success("Login realizado com sucesso!");
      } else if (result.requiresMFA) {
        setShowMFA(true);
        toast.info("Digite o código de autenticação");
      } else {
        toast.error(result.error || "Erro ao fazer login");
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await challengeMFA(mfaCode);

      if (result.success) {
        toast.success("Autenticação completa!");
      } else {
        toast.error(result.error || "Código inválido");
      }
    } catch (error) {
      toast.error("Erro ao verificar código");
    } finally {
      setLoading(false);
    }
  };

  if (showMFA) {
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
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl mb-2">Autenticação de Dois Fatores</h1>
              <p className="text-muted-foreground text-sm">
                Digite o código do seu aplicativo autenticador
              </p>
            </div>

            <form onSubmit={handleMFASubmit} className="space-y-6">
              <div>
                <label htmlFor="mfaCode" className="block mb-2 text-sm">
                  Código 2FA
                </label>
                <input
                  type="text"
                  id="mfaCode"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-accent rounded-lg border border-border focus:border-violet-500 focus:outline-none transition-colors text-center text-2xl tracking-widest"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verificando..." : "Verificar Código"}
              </motion.button>

              <button
                type="button"
                onClick={() => setShowMFA(false)}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Voltar
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <h1 className="text-3xl mb-2">Bem-vindo ao Equilibra</h1>
            <p className="text-muted-foreground">
              Entre para gerenciar suas finanças
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-accent rounded-lg border border-border focus:border-violet-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-accent rounded-lg border border-border focus:border-violet-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Ainda não tem uma conta?{" "}
              <Link
                to="/signup"
                className="text-violet-500 hover:text-violet-400 font-medium transition-colors"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Seus dados estão protegidos com criptografia de ponta a ponta
        </p>
      </motion.div>
    </div>
  );
}

export function Login() {
  return (
    <AuthProvider>
      <LoginForm />
      <Toaster position="top-right" theme="dark" />
    </AuthProvider>
  );
}
