import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Shield, Copy, Check, ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/auth-context";
import { toast } from "sonner";

export function MFASetup() {
  const navigate = useNavigate();
  const { enrollMFA, verifyMFA } = useAuth();
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const result = await enrollMFA();

      if (result.success && result.qrCode && result.secret) {
        setQrCode(result.qrCode);
        setSecret(result.secret);
        toast.success("QR Code gerado com sucesso!");
      } else {
        toast.error(result.error || "Erro ao configurar 2FA");
      }
    } catch (error) {
      toast.error("Erro ao configurar 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyMFA(code);

      if (result.success) {
        toast.success("2FA configurado com sucesso!");
        navigate("/");
      } else {
        toast.error(result.error || "Código inválido");
      }
    } catch (error) {
      toast.error("Erro ao verificar código");
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!qrCode) {
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
              <h1 className="text-2xl mb-2">Configurar Autenticação 2FA</h1>
              <p className="text-muted-foreground text-sm">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  A autenticação de dois fatores (2FA) protege sua conta mesmo
                  que sua senha seja comprometida.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-violet-500 mt-0.5">•</span>
                    <span>Você precisará de um app autenticador (Google Authenticator, Authy, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-500 mt-0.5">•</span>
                    <span>A cada login, será solicitado um código temporário</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-500 mt-0.5">•</span>
                    <span>Mantenha o código de recuperação em local seguro</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={handleEnroll}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Gerando..." : "Começar configuração"}
              </motion.button>

              <button
                onClick={() => navigate("/")}
                className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Configurar depois
              </button>
            </div>
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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl mb-2">Escaneie o QR Code</h1>
            <p className="text-muted-foreground text-sm">
              Use seu app autenticador para escanear o código
            </p>
          </div>

          <div className="mb-8">
            <div className="bg-white p-4 rounded-lg mb-4">
              <img src={qrCode} alt="QR Code 2FA" className="w-full h-auto" />
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">
                Ou digite o código manualmente:
              </p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono break-all">{secret}</code>
                <button
                  onClick={copySecret}
                  className="p-2 hover:bg-background rounded transition-colors flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="code" className="block mb-2 text-sm">
                Digite o código do app
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
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
              {loading ? "Verificando..." : "Confirmar e ativar 2FA"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
