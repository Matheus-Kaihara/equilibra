import { Navigate, Outlet } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "../contexts/auth-context";

function ProtectedContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function ProtectedRoute() {
  return (
    <AuthProvider>
      <ProtectedContent />
      <Toaster position="top-right" theme="dark" />
    </AuthProvider>
  );
}
