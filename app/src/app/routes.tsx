import { createHashRouter } from "react-router";
import { Layout } from "./components/layout";
import { Dashboard } from "./components/dashboard";
import { Transactions } from "./components/transactions";
import { AddTransaction } from "./components/add-transaction";
import { Login } from "./components/auth/login";
import { Signup } from "./components/auth/signup";
import { ForgotPassword } from "./components/auth/forgot-password";
import { MFASetup } from "./components/auth/mfa-setup";
import { ProtectedRoute } from "./components/protected-route";

export const router = createHashRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        // Layout route sem path — renderiza o Layout como wrapper de todas as rotas protegidas
        Component: Layout,
        children: [
          { index: true, Component: Dashboard },
          { path: "transactions", Component: Transactions },
          { path: "add", Component: AddTransaction },
          { path: "mfa-setup", Component: MFASetup },
        ],
      },
    ],
  },
]);
