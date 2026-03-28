import { useState, useEffect } from "react";
import { Trash2, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { motion } from "motion/react";
import { Transaction } from "../types";

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const stored = localStorage.getItem("transactions");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ordenar por data (mais recente primeiro)
      parsed.sort((a: Transaction, b: Transaction) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(parsed);
    }
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(updated));
    setTransactions(updated);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Suas Transações</h1>
        <p className="text-muted-foreground">
          Acompanhe todas as suas movimentações financeiras
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "all"
                ? "bg-violet-600 text-white"
                : "bg-accent text-accent-foreground hover:bg-accent/80"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("income")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "income"
                ? "bg-green-600 text-white"
                : "bg-accent text-accent-foreground hover:bg-accent/80"
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => setFilter("expense")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "expense"
                ? "bg-red-600 text-white"
                : "bg-accent text-accent-foreground hover:bg-accent/80"
            }`}
          >
            Despesas
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-6 hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <TrendingDown className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-lg">{transaction.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {transaction.category}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`text-xl font-semibold ${
                      transaction.type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}R${" "}
                    {transaction.amount.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Nenhuma transação encontrada</p>
            <p className="text-sm mt-2">
              {filter !== "all"
                ? "Tente ajustar os filtros"
                : "Comece adicionando sua primeira transação"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}