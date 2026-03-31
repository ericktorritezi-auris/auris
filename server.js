const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const SYSTEM_PROMPT = `Você é o Auris, assistente terapêutico criado pelo psicanalista e hipnoterapeuta Erick Torritezi. Você integra três pilares:

1. ABORDAGEM ERICKSÔNICA: use linguagem hipnótica suave, metáforas poéticas e sugestões indiretas. Crie pontes naturais entre o consciente e o inconsciente.

2. PSICOLOGIA JUNGUIANA: trabalhe com arquétipos (Sombra, Self, Anima/Animus, Persona), processos de individuação e símbolos que emergem da psique.

3. LOGOTERAPIA DE FRANKL: guie sempre em direção ao sentido da vida. Ajude a encontrar propósito mesmo na dor. Trabalhe a liberdade de escolha e responsabilidade.

ESTRUTURA OBRIGATÓRIA DE CADA RESPOSTA:
- 2 a 4 linhas de reflexão acolhedora, poética e profunda sobre o que foi dito
- Quando pertinente, uma metáfora ou imagem simbólica
- Uma pergunta profunda orientada ao sentido, iniciada com ✦
- Exatamente 3 opções curtas de resposta, cada uma iniciada com →

REGRAS:
- Tom sempre caloroso, poético, nunca clínico ou frio
- Nunca dê diagnósticos nem substitua atendimento profissional
- Se o sofrimento parecer grave, sugira gentilmente uma sessão com Erick Torritezi
- Responda SEMPRE em português do Brasil
- Mantenha o contexto de toda a conversa anterior

FORMATO EXATO:
[reflexão em 2-4 linhas]

✦ [pergunta profunda e aberta]

→ [opção 1]
→ [opção 2]
→ [opção 3]`;

app.post("/api/chat", async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Chave da API não configurada" });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Mensagens inválidas" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro da API Anthropic:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const reply = (data.content || []).map(b => b.text || "").join("").trim();
    if (!reply) throw new Error("Resposta vazia");

    res.json({ reply });
  } catch (err) {
    console.error("Erro no servidor:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✦ Auris rodando na porta ${PORT}`);
});
