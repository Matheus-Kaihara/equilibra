# Template de e-mail — Redefinição de senha (PT-BR)

Este guia define o conteúdo recomendado para o template do Supabase Dashboard em:

`Auth > Email Templates > Reset Password`

## Assunto (Subject)

```text
Equilibra | Redefina sua senha com segurança
```

## Corpo (HTML)

> Observação: o botão usa o fluxo com `token_hash` para manter compatibilidade com `HashRouter`.

```html
<h2 style="margin:0 0 16px;font-family:Arial,sans-serif;color:#171717;">Redefinição de senha</h2>

<p style="margin:0 0 12px;font-family:Arial,sans-serif;color:#3f3f46;line-height:1.6;">
  Olá,
</p>

<p style="margin:0 0 16px;font-family:Arial,sans-serif;color:#3f3f46;line-height:1.6;">
  Recebemos um pedido para redefinir a senha da sua conta na <strong>Equilibra</strong>.
  Para continuar com segurança, clique no botão abaixo.
</p>

<p style="margin:24px 0;">
  <a
    href="{{ .SiteURL }}/#/reset-password?token_hash={{ .TokenHash }}&type=recovery"
    style="display:inline-block;padding:12px 20px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:10px;font-family:Arial,sans-serif;font-weight:600;"
  >
    Redefinir senha agora
  </a>
</p>

<p style="margin:0 0 12px;font-family:Arial,sans-serif;color:#52525b;line-height:1.6;">
  <strong>Aviso de segurança:</strong> se você não solicitou esta alteração, ignore este e-mail.
  Sua senha atual continuará válida até que uma nova senha seja confirmada.
</p>

<p style="margin:0 0 12px;font-family:Arial,sans-serif;color:#52525b;line-height:1.6;">
  Por segurança, este link expira automaticamente em breve.
  Se expirar, solicite uma nova recuperação no app.
</p>

<p style="margin:16px 0 0;font-family:Arial,sans-serif;color:#71717a;line-height:1.6;">
  Com cuidado,<br />
  Time Equilibra
</p>
```

## URL do novo fluxo de recuperação

Use o botão com este padrão:

```text
{{ .SiteURL }}/#/reset-password?token_hash={{ .TokenHash }}&type=recovery
```

Esse formato evita dependência de URL sem hash e funciona com `createHashRouter`.

## Revisão no painel do Supabase (produção)

Antes de habilitar o envio em produção, revise no dashboard:

1. **Políticas de envio de Auth** em `Auth > Settings` (rate limits, expiração de links e domínio permitido de redirecionamento).
2. **Provedor de e-mail SMTP próprio** em `Auth > Settings > SMTP Settings` para reduzir bloqueios de provedores, melhorar entregabilidade e ter controle de limites.
3. **Domínio de envio autenticado** (SPF, DKIM e, se disponível, DMARC) para aumentar reputação do remetente.

> Recomendação: use SMTP próprio em produção e mantenha o provedor padrão apenas para desenvolvimento/testes rápidos.
