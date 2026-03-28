import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { insertTransaction } from "../lib/transactions";

const CATEGORIES = {
  expense: [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Educação",
    "Lazer",
    "Compras",
    "Contas",
    "Outros",
  ],
  income: [
    "Salário",
    "Freelance",
    "Investimentos",
    "Prêmio",
    "Presente",
    "Outros",
  ],
};

export function AddTransaction() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.category) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);

    const { error } = await insertTransaction({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date,
    });

    setSubmitting(false);

    if (error) {
      toast.error(`Erro ao salvar transação: ${error.message}`);
      return;
    }

    toast.success("Transação adicionada com sucesso!");
    navigate("/");
  };

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      <div>
        <h1 className="text-3xl mb-2">Nova Movimentação</h1>
        <p className="text-muted-foreground mb-8">
          Registre uma receita ou despesa de forma simples
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-8 rounded-xl border border-border"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type */}
          <div>
            <label className="block mb-3">Tipo de Transação</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, type: "income", category: "" })
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === "income"
                    ? "border-green-500 bg-green-500/10"
                    : "border-border bg-accent/50 hover:bg-accent"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                      formData.type === "income"
                        ? "bg-green-500 text-white"
                        : "bg-green-500/20 text-green-500"
                    }`}
                  >
                    +
                  </div>
                  <p>Receita</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, type: "expense", category: "" })
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === "expense"
                    ? "border-red-500 bg-red-500/10"
                    : "border-border bg-accent/50 hover:bg-accent"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                      formData.type === "expense"
                        ? "bg-red-500 text-white"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    -
                  </div>
                  <p>Despesa</p>
                </div>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2">
              Descrição *
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Ex: Compra no supermercado"
              className="w-full px-4 py-3 bg-accent rounded-lg border border-border focus:border-violet-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block mb-2">
              Valor (R$) *
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0,00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-accent rounded-lg border border-border focus:border-violet-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block mb-2">
              Categoria *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 bg-accent rounded-lg border border-border focus:border-violet-500 focus:outline-none transition-colors"
              required
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIES[formData.type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block mb-2">
              Data *
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-3 bg-accent rounded-lg border border-border focus:border-violet-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {submitting ? "Salvando..." : "Salvar Transação"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
