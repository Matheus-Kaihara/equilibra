import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/auth-context";

function ForgotPasswordForm() {
  const RATE_LIMIT_COOLDOWN_STEPS = [60, 120, 300];
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [consecutiveRateLimitErrors, setConsecutiveRateLimitErrors] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setCooldown((previousCooldown) => {
        if (previousCooldown <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return previousCooldown - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [cooldown]);

  const startDefaultCooldown = () => {
    setCooldown(RATE_LIMIT_COOLDOWN_STEPS[0]);
  };

  const startRateLimitCooldown = () => {
    const nextCooldownIndex = Math.min(
      consecutiveRateLimitErrors,
      RATE_LIMIT_COOLDOWN_STEPS.length - 1,
    );
    setCooldown(RATE_LIMIT_COOLDOWN_STEPS[nextCooldownIndex]);
    setConsecutiveRateLimitErrors((previousCount) => previousCount + 1);
  };

  const isRateLimitError = (errorMessage?: string) => {
    if (!errorMessage) {
      return false;
    }

    const normalizedError = errorMessage.toLowerCase();
    return normalizedError.includes("rate limit")
      || normalizedError.includes("429")
      || normalizedError.includes("too many requests")
      || normalizedError.includes("muitas tentativas")
      || normalizedError.includes("limite");
  };

  const RATE_LIMIT_TOAST_MESSAGE = "Muitas tentativas no servidor. Aguarde alguns minutos e tente novamente.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || cooldown > 0) {
      return;
    }

    setLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        toast.success("Se o e-mail existir, enviaremos um link de recuperação. Verifique sua caixa de entrada.");
        setConsecutiveRateLimitErrors(0);
        startDefaultCooldown();
      } else {
        if (isRateLimitError(result.error)) {
          startRateLimitCooldown();
        }
      }
    } catch (error) {
      if (
        error instanceof Error
        && isRateLimitError(error.message)
      ) {
        startRateLimitCooldown();
      }
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
              disabled={loading || cooldown > 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : cooldown > 0 ? `Reenviar em ${cooldown}s` : "Enviar link"}
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
