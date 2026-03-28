import { supabase } from "./supabase-client";
import { Transaction } from "../types";

interface TransactionInsertInput {
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
}

const TRANSACTIONS_TABLE = "transactions";

type DatabaseErrorLike = {
  message?: string;
  code?: string;
};

export function getTransactionsErrorMessage(error: DatabaseErrorLike | null) {
  if (!error) return "Erro desconhecido";

  const message = error.message ?? "";

  if (
    error.code === "PGRST205" ||
    message.includes("Could not find the table 'public.transactions'")
  ) {
    return "A tabela de transações ainda não existe no Supabase deste ambiente. Execute a migration `202603280001_create_transactions_table.sql` no SQL Editor.";
  }

  return message || "Erro ao acessar transações";
}

export async function fetchTransactions() {
  return supabase
    .from(TRANSACTIONS_TABLE)
    .select("id, user_id, description, amount, category, type, date, created_at, updated_at")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
}

export async function insertTransaction(input: TransactionInsertInput) {
  return supabase
    .from(TRANSACTIONS_TABLE)
    .insert(input)
    .select("id, user_id, description, amount, category, type, date, created_at, updated_at")
    .single<Transaction>();
}

export async function removeTransaction(id: string) {
  return supabase.from(TRANSACTIONS_TABLE).delete().eq("id", id);
}
