import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Receipt, PlusCircle, Wallet, LogOut, Shield, User } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/auth-context";
import { toast } from "sonner";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/transactions", icon: Receipt, label: "Transações" },
    { path: "/add", icon: PlusCircle, label: "Adicionar" },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Equilibra</h1>
                <p className="text-xs text-muted-foreground">Suas finanças em equilíbrio</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative"
                >
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-violet-600 text-white"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.name || "Usuário"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* 2FA Setup */}
            <Link
              to="/mfa-setup"
              className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm">Configurar 2FA</span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}