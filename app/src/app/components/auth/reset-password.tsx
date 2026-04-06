import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase-client";

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenReady, setTokenReady] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        setTokenError(error.message || "Não foi possível validar o link de recuperação");
        return;
      }

      setTokenReady(true);
    };

    verifyRecoveryToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenReady || tokenError) {
      toast.error(tokenError || "Link de recuperação inválido ou expirado");
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

          {!tokenReady ? (
            <div className="rounded-lg border border-border bg-accent p-4 text-sm text-muted-foreground">
              {tokenError || "Validando link de recuperação..."}
            </div>
          ) : null}

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
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !tokenReady}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
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
