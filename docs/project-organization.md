# 📁 Organização do Projeto

Este documento descreve a organização das pastas e arquivos do projeto, com o objetivo de manter a documentação clara, escalável e fácil de consultar.

---

## 📁 Explicação das pastas

### 🎨 `/docs/brand`

Contém a base de identidade da empresa e da marca.

**Arquivos desta pasta:**
- `brand-foundation.md`: propósito, missão, visão, valores, posicionamento e personalidade da marca;
- `naming.md`: nomes estudados, justificativas e definições da marca;
- `tone-of-voice.md`: diretrizes de comunicação e tom de voz;
- `visual-direction.md`: direção visual da marca, estilo, referências e identidade conceitual.

**Use esta pasta para responder:**
- quem somos;
- por que existimos;
- como queremos ser percebidos;
- como a marca deve se comunicar.

---

### 🚀 `/docs/product`

Contém a visão e a estratégia do produto.

**Arquivos desta pasta:**
- `product-vision.md`: visão geral do produto e proposta de valor;
- `mvp-scope.md`: escopo da primeira versão do sistema;
- `prd.md`: documento de requisitos do produto;
- `roadmap.md`: evolução planejada por fases.

**Use esta pasta para responder:**
- o que o produto é;
- qual problema ele resolve;
- o que entra no MVP;
- como ele deve evoluir ao longo do tempo.

---

### 🧩 `/docs/specs`

Contém as especificações funcionais dos módulos do sistema.

**Arquivos desta pasta:**
- `auth-spec.md`: autenticação, login, cadastro e acesso;
- `dashboard-spec.md`: painel inicial e visão resumida do usuário;
- `accounts-spec.md`: contas a pagar e organização de contas;
- `expenses-spec.md`: cadastro e gestão de despesas;
- `income-spec.md`: cadastro e gestão de receitas;
- `reports-spec.md`: relatórios e análises iniciais.

**Use esta pasta para responder:**
- como cada funcionalidade funciona;
- quais campos existem;
- quais fluxos o usuário percorre;
- quais regras e critérios de aceite devem ser respeitados.

---

### 🛠️ `/docs/technical`

Contém documentação técnica do sistema.

**Arquivos desta pasta:**
- `architecture-overview.md`: visão geral da arquitetura;
- `database-model.md`: modelagem inicial de entidades e relacionamentos;
- `api-overview.md`: visão dos endpoints e integrações;
- `security-guidelines.md`: diretrizes de segurança do projeto.

**Use esta pasta para responder:**
- como o sistema será estruturado tecnicamente;
- como os dados serão organizados;
- como o front-end e o back-end se relacionam;
- quais práticas de segurança devem ser seguidas.

---

### 📅 `/docs/planning`

Contém o planejamento e o acompanhamento do projeto.

**Arquivos desta pasta:**
- `backlog.md`: lista de funcionalidades, melhorias e tarefas;
- `milestones.md`: marcos importantes do projeto;
- `decisions-log.md`: registro de decisões estratégicas, funcionais e técnicas.

**Use esta pasta para responder:**
- o que precisa ser feito;
- o que já foi decidido;
- quais são os próximos passos;
- como acompanhar a evolução do projeto.

---

## 📘 Função do `README.md`

Este arquivo serve como **ponto de entrada do projeto**.

Ele deve ajudar qualquer pessoa a entender rapidamente:
- o que é o projeto;
- como a documentação está organizada;
- onde encontrar cada tipo de informação;
- qual é a lógica da estrutura adotada.

---

## 🧭 Ordem recomendada de documentação

A criação e manutenção dos documentos pode seguir esta ordem:

### 1. Base da marca

**Criar primeiro:**
- `docs/brand/brand-foundation.md`
- `docs/brand/naming.md`

### 2. Base do produto

**Criar depois:**
- `docs/product/product-vision.md`
- `docs/product/mvp-scope.md`
- `docs/product/prd.md`

### 3. Especificações do MVP

**Criar em seguida:**
- `docs/specs/auth-spec.md`
- `docs/specs/dashboard-spec.md`
- `docs/specs/accounts-spec.md`
- `docs/specs/expenses-spec.md`
- `docs/specs/income-spec.md`
- `docs/specs/reports-spec.md`

### 4. Base técnica

**Criar depois:**
- `docs/technical/architecture-overview.md`
- `docs/technical/database-model.md`
- `docs/technical/api-overview.md`

### 5. Planejamento contínuo

**Manter sempre atualizado:**
- `docs/planning/backlog.md`
- `docs/planning/milestones.md`
- `docs/planning/decisions-log.md`

---

## 📝 Convenções de nomenclatura

Para manter o projeto padronizado, seguir estas convenções:

- usar nomes em minúsculo;
- usar hífens no lugar de espaços;
- evitar acentos e caracteres especiais;
- manter nomes claros e diretos;
- separar documentação por responsabilidade.

### ✅ Exemplos corretos
- `brand-foundation.md`
- `mvp-scope.md`
- `dashboard-spec.md`
- `database-model.md`

### ⚠️ Exemplos a evitar
- `Documento Final do Produto.md`
- `Minha spec do dashboard.md`
- `versão nova produto.md`

---

## 📚 Como manter a documentação organizada

### Princípios
- cada arquivo deve ter um objetivo claro;
- evitar misturar branding com regra de sistema;
- evitar misturar requisito funcional com detalhe técnico;
- manter os documentos curtos, objetivos e versionáveis;
- dividir specs por módulo sempre que necessário.

### Boas práticas
- atualizar o `decisions-log.md` quando houver decisões importantes;
- revisar o `mvp-scope.md` antes de adicionar novas funcionalidades;
- detalhar regras novas dentro da spec correta;
- manter o `README.md` coerente com a estrutura real do projeto.

---

## 🔎 Fluxo recomendado de uso

### Quando a dúvida for sobre identidade
**Consultar:**
- `docs/brand/`

### Quando a dúvida for sobre o produto
**Consultar:**
- `docs/product/`

### Quando a dúvida for sobre comportamento de uma funcionalidade
**Consultar:**
- `docs/specs/`

### Quando a dúvida for sobre implementação técnica
**Consultar:**
- `docs/technical/`

### Quando a dúvida for sobre prioridades e andamento
**Consultar:**
- `docs/planning/`

---

## 🎯 Direção inicial do produto

A primeira versão da plataforma deverá focar no núcleo da proposta:

- autenticação de usuários;
- dashboard inicial;
- cadastro de receitas;
- cadastro de despesas;
- cadastro de contas;
- visualização de saldo;
- relatórios básicos;
- experiência moderna e responsiva.

**Expansões futuras podem incluir:**
- educação financeira;
- relatórios avançados;
- metas;
- lembretes;
- insights;
- integrações.

---

## 💡 Resumo da identidade do projeto

A marca foi concebida para transmitir:

- modernidade;
- acessibilidade;
- organização;
- segurança;
- clareza;
- confiança.

**Valores centrais:**
- transparência;
- segurança;
- organização;
- acessibilidade;
- simplicidade;
- autonomia.