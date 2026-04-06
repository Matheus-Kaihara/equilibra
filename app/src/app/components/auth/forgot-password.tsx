import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/auth-context";

function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        toast.success("Se o e-mail existir, enviaremos um link de recuperação. Verifique sua caixa de entrada.");
      } else {
        toast.error(result.error || "Erro ao solicitar link de recuperação");
      }
    } catch (error) {
      toast.error("Erro ao solicitar link de recuperação");
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
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl mb-2 text-white">Recuperar senha</h1>
            <p className="text-muted-foreground">
              Informe seu e-mail para receber o link de redefinição
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm text-white">
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
                  className="w-full pl-11 pr-4 py-3 bg-accent text-white rounded-lg border border-border placeholder:text-zinc-300 focus:border-violet-500 focus:outline-none transition-colors"
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
              {loading ? "Enviando..." : "Enviar link"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-violet-500 hover:text-violet-400 font-medium transition-colors"
            >
              Voltar ao login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ForgotPassword() {
  return <ForgotPasswordForm />;
}
