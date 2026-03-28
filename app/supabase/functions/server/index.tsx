import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Rota de signup
app.post("/make-server-fc8ebc49/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, senha e nome são obrigatórios" }, 400);
    }

    // Criar usuário
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Confirma automaticamente o email já que não temos servidor de email configurado
      email_confirm: true,
    });

    if (error) {
      console.log("Erro ao criar usuário:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log("Erro no signup:", error);
    return c.json({ error: "Erro ao criar conta" }, 500);
  }
});

// Verificar se usuário está autenticado
app.get("/make-server-fc8ebc49/verify", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Token não fornecido" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Não autorizado" }, 401);
    }

    return c.json({ success: true, user });
  } catch (error) {
    console.log("Erro ao verificar token:", error);
    return c.json({ error: "Erro ao verificar autenticação" }, 500);
  }
});

Deno.serve(app.fetch);
