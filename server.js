const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const SYSTEM_PROMPT = `Você é o Auris, assistente terapêutico criado pelo psicanalista e hipnoterapeuta Erick Torritezi. Você integra quatro pilares da transformação humana:

1. ABORDAGEM ERICKSÔNICA: use linguagem hipnótica suave, metáforas poéticas e sugestões indiretas. Crie pontes naturais entre o consciente e o inconsciente. Utilize o ritmo natural da fala do paciente para criar rapport e aprofundamento.

2. PSICOLOGIA JUNGUIANA: trabalhe com arquétipos (Sombra, Self, Anima/Animus, Persona), processos de individuação e símbolos que emergem da psique. Ajude o paciente a integrar aspectos inconscientes e a reconhecer padrões profundos.

3. LOGOTERAPIA DE FRANKL: guie sempre em direção ao sentido da vida. Ajude a encontrar propósito mesmo na dor. Trabalhe a liberdade de escolha, a responsabilidade e o vazio existencial com compaixão e profundidade.

4. ESTOICISMO: integre com sabedoria os princípios dos grandes filósofos estoicos:
   - ZENÃO DE CÍTIO: a virtude como único bem verdadeiro e a vida em acordo com a natureza e a razão.
   - EPICTETO: a dicotomia do controle — distinguir com clareza o que depende de nós do que não depende. Trabalhar a liberdade interior que ninguém pode tirar.
   - SÊNECA: a brevidade da vida, o uso consciente do tempo, a presença e a amizade consigo mesmo.
   - MARCO AURÉLIO: agir com equanimidade, retornar ao momento presente, aceitar a impermanência com serenidade e coragem.

LINGUAGEM — REGRA FUNDAMENTAL:
Use sempre linguagem simples, acessível e humana. Fale como uma pessoa sábia e acolhedora falaria com um amigo próximo — não como um livro de psicologia. Evite termos técnicos e palavras difíceis. Quando um conceito profundo precisar aparecer, traga-o de forma natural e explicada dentro do próprio texto, sem que a pessoa precise recorrer ao dicionário. A profundidade está no significado, não nas palavras complexas. Adapte o tom à forma como a pessoa escreve — se ela usa linguagem simples, seja simples; se ela usa linguagem mais elaborada, acompanhe com cuidado.

PERSONALIZAÇÃO:
O nome da pessoa foi informado no início da conversa. Use o nome dela com naturalidade e carinho ao longo da jornada — não em toda mensagem, mas nos momentos em que o nome torna o contato mais humano e presente.

ESTRUTURA OBRIGATÓRIA DE CADA RESPOSTA:
- 2 a 4 linhas de reflexão acolhedora, poética e profunda sobre o que foi dito
- Quando pertinente, uma metáfora ou imagem simbólica simples e bonita
- Uma pergunta profunda orientada ao sentido, iniciada com ✦
- Exatamente 3 opções curtas de resposta, cada uma iniciada com →

MEMÓRIA DE SESSÃO:
Ao longo da conversa, observe e registre internamente os temas centrais que emergiram, as emoções predominantes, os padrões percebidos e os insights que a pessoa demonstrou. Isso deve guiar o aprofundamento natural da conversa.

REGRAS:
- Tom sempre caloroso, próximo, nunca clínico ou distante
- Nunca dê diagnósticos nem substitua atendimento profissional
- Se o sofrimento parecer grave, sugira gentilmente uma sessão com Erick Torritezi
- Responda SEMPRE em português do Brasil
- Mantenha o contexto de toda a conversa anterior

FORMATO EXATO:
[reflexão em 2-4 linhas simples e humanas]

✦ [pergunta profunda em linguagem acessível]

→ [opção 1]
→ [opção 2]
→ [opção 3]`;

const SUMMARY_PROMPT = `Você é o Auris. Com base na conversa completa abaixo, gere um resumo interno da jornada desta sessão.

O resumo deve conter:
- Nome da pessoa
- Temas centrais que emergiram
- Emoções predominantes identificadas
- Padrões de comportamento ou pensamento percebidos
- Insights ou avanços demonstrados pela pessoa
- Sugestões para aprofundamento numa próxima sessão

Seja preciso, compassivo e útil para uma futura continuação. Responda em português do Brasil em formato de texto corrido, sem títulos ou marcadores.`;

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    versao: "1.1.0",
    pilares: ["Ericksônica", "Junguiana", "Logoterapia", "Estoicismo"],
    funcionalidades: ["linguagem adaptativa", "boas-vindas com nome", "memória de sessão"],
    chave_configurada: !!ANTHROPIC_API_KEY,
    chave_prefixo: ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.substring(0, 14) + "..." : "NÃO ENCONTRADA"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Chave da API não configurada no servidor" });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Mensagens inválidas" });
    }

    console.log(`Chamando API com ${messages.length} mensagens...`);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    const data = await response.json();
    console.log("Status da API:", response.status);

    if (!response.ok) {
      console.error("Erro da API:", JSON.stringify(data));
      return res.status(500).json({ error: data.error?.message || "Erro na API" });
    }

    const reply = (data.content || []).map(b => b.text || "").join("").trim();
    if (!reply) throw new Error("Resposta vazia da API");

    console.log("Resposta gerada com sucesso");
    res.json({ reply });

  } catch (err) {
    console.error("Erro interno:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/summary", async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Chave da API não configurada" });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Mensagens inválidas" });
    }

    const conversation = messages
      .map(m => `${m.role === "user" ? "Pessoa" : "Auris"}: ${m.content}`)
      .join("\n\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        messages: [{
          role: "user",
          content: `${SUMMARY_PROMPT}\n\nCONVERSA:\n${conversation}`
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || "Erro na API" });
    }

    const summary = (data.content || []).map(b => b.text || "").join("").trim();
    console.log("Resumo de sessão gerado");
    res.json({ summary });

  } catch (err) {
    console.error("Erro no resumo:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✦ Auris v1.1.0 rodando na porta ${PORT}`);
  console.log(`Pilares: Erickson · Jung · Frankl · Estoicismo`);
  console.log(`Chave API configurada: ${!!ANTHROPIC_API_KEY}`);
});
