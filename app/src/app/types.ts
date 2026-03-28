export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  created_at: string;
  updated_at: string;
}
