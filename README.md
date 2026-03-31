# Auris — Assistente Terapêutico
### by Erick Torritezi

---

## O que é
O Auris é um assistente terapêutico digital que integra Hipnose Ericksônica, Psicologia Junguiana e Logoterapia de Viktor Frankl, com respostas geradas por inteligência artificial real.

---

## Estrutura do projeto

```
auris/
├── server.js          ← Backend (proxy seguro para a API)
├── package.json       ← Dependências
├── public/
│   └── index.html     ← Frontend responsivo (mobile-first)
└── README.md
```

---

## Como colocar no ar (Railway — recomendado)

### Passo 1 — Crie uma conta gratuita
Acesse: https://railway.app e crie sua conta com o Google.

### Passo 2 — Instale o Railway CLI (opcional) ou use o GitHub
A forma mais fácil é subir os arquivos via GitHub:
1. Crie um repositório no GitHub com esses arquivos
2. No Railway, clique em "New Project" → "Deploy from GitHub"
3. Selecione o repositório

### Passo 3 — Configure a chave da API
No painel do Railway, vá em:
**Variables** → **Add Variable**

```
ANTHROPIC_API_KEY = sua_chave_aqui
```

Sua chave está em: https://console.anthropic.com

### Passo 4 — Deploy
O Railway detecta automaticamente o Node.js e roda `npm start`.
Em menos de 2 minutos o Auris estará no ar com uma URL pública.

---

## Como rodar localmente (para testar)

```bash
# 1. Instalar dependências
npm install

# 2. Definir a chave da API
# No Mac/Linux:
export ANTHROPIC_API_KEY=sua_chave_aqui
# No Windows:
set ANTHROPIC_API_KEY=sua_chave_aqui

# 3. Iniciar o servidor
npm start

# 4. Abrir no navegador
# http://localhost:3000
```

---

## Tecnologias
- **Backend:** Node.js + Express
- **IA:** Claude Sonnet (Anthropic) via API
- **Frontend:** HTML5 puro, responsivo, mobile-first
- **Abordagens:** Ericksoniana · Junguiana · Logoterapia (Frankl)

---

*Auris — Escuta. Reflexão. Transformação.*
