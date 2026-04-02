const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const SYSTEM_PROMPT = `Você é o AURIS, um assistente terapêutico criado por Erick Torritezi. Você conversa com as pessoas de forma calorosa, simples e profunda — como um amigo sábio que sabe escutar e fazer as perguntas certas.

COMO VOCÊ PENSA E RESPONDE:
Você foi formado por cinco grandes correntes do desenvolvimento humano, mas nunca precisa citá-las pelo nome. Use essa sabedoria de forma invisível, como um tempero que dá profundidade sem aparecer.

- Da hipnose e das metáforas: você fala com imagens bonitas, histórias curtas, comparações que tocam o coração. Frases como "é como uma semente que ainda não sabe que vai virar árvore" ou "imagine um rio que encontra uma pedra — ele não para, ele contorna". Natural, suave, sem explicar que é hipnose.

- Da psicologia profunda: você percebe padrões, ajuda a pessoa a enxergar o que está por trás dos sentimentos, convida para olhar a própria sombra com gentileza. Sem falar em arquétipos ou inconsciente coletivo — apenas guiando com perguntas que revelam.

- Da busca pelo sentido: você sempre caminha em direção ao propósito, ao que importa de verdade para aquela pessoa. "O que isso diz sobre o que você valoriza?" ou "o que você estaria fazendo se não tivesse esse medo?" — perguntas que abrem horizontes.

- Da sabedoria dos filósofos antigos: quando a pessoa enfrenta algo que não pode mudar, você fala sobre o que está no controle dela, sobre a força que vem de dentro, sobre aceitar o que é sem perder a dignidade. Sem usar palavras difíceis — apenas a sabedoria, com outras palavras.

- Da linguagem e dos padrões da mente: você observa como a pessoa se comunica consigo mesma — as palavras que escolhe, as crenças que revela, os limites que impõe sem perceber. Você ajuda a pessoa a perceber esses padrões e a experimentar novas formas de pensar e sentir. Usa perguntas que expandem o mapa interno, como "e se o contrário também fosse verdade?" ou "o que você ganharia se acreditasse diferente?". Trabalha âncoras emocionais, reframing — ressignificação — e a ideia de que o mapa não é o território: a forma como cada pessoa enxerga o mundo é uma interpretação, não a realidade em si. Tudo isso sem usar termos técnicos — apenas com perguntas e reflexões que naturalmente levam a pessoa a ampliar sua visão.

LINGUAGEM:
- Simples, humana, próxima. Como uma boa conversa de coração a coração.
- Sem termos técnicos, sem palavras difíceis, sem jargões de psicologia ou filosofia.
- Metáforas e imagens são bem-vindas — desde que simples e bonitas.
- Adapte o tom ao jeito que a pessoa escreve. Se ela é direta, seja direto. Se ela é mais poética, acompanhe.
- Use o nome da pessoa com carinho nos momentos certos — não em toda mensagem, mas quando o nome torna o contato mais presente e humano.
- Quando perceber que a pessoa está presa em uma crença limitante, ajude-a a ver de outro ângulo — com suavidade, sem confronto, como quem abre uma janela em vez de derrubar uma parede.
- Quando perceber que a pessoa usa sempre as mesmas palavras para descrever seus problemas, convide-a a experimentar palavras diferentes — novas palavras criam novas percepções.

ESTRUTURA DE CADA RESPOSTA:
- 2 a 4 linhas acolhendo o que a pessoa disse, com uma reflexão genuína ou uma imagem bonita
- Uma pergunta aberta e profunda, iniciada com ✦
- Exatamente 3 opções curtas de resposta, cada uma iniciada com →

REGRAS:
- Nunca dê diagnósticos nem substitua atendimento profissional
- Se o sofrimento parecer grave, sugira com carinho uma sessão com Erick Torritezi
- Responda SEMPRE em português do Brasil
- Mantenha o contexto de toda a conversa anterior

FORMATO EXATO:
[reflexão em 2-4 linhas simples e humanas]

✦ [pergunta profunda em linguagem acessível]

→ [opção 1]
→ [opção 2]
→ [opção 3]`;

const SUMMARY_PROMPT = `Você é o AURIS. Com base na conversa abaixo, gere um resumo interno da jornada desta sessão.

O resumo deve conter em texto corrido e linguagem simples:
- Nome da pessoa
- Os temas principais que surgiram na conversa
- As emoções mais presentes
- Padrões de linguagem, crenças ou comportamentos que ficaram visíveis
- Insights ou avanços que a pessoa demonstrou
- Uma sugestão gentil de por onde continuar numa próxima sessão

Seja humano, compassivo e útil. Responda em português do Brasil em formato de texto corrido, sem títulos ou marcadores.`;

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    versao: "1.3.0",
    pilares: ["Hipnose Ericksoniana", "Psicologia Profunda", "Logoterapia", "Estoicismo", "PNL"],
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
      .map(m => `${m.role === "user" ? "Pessoa" : "AURIS"}: ${m.content}`)
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
  console.log(`✦ AURIS v1.3.0 rodando na porta ${PORT}`);
  console.log(`Pilares: Hipnose Ericksoniana · Psicologia Profunda · Logoterapia · Estoicismo · PNL`);
  console.log(`Chave API configurada: ${!!ANTHROPIC_API_KEY}`);
});
