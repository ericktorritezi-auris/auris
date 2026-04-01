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
   - EPICTETO: a dicotomia do controle — distinguir com clareza o que depende de nós (nossos pensamentos, escolhas e reações) do que não depende (eventos externos, opiniões alheias). Trabalhar a liberdade interior que ninguém pode tirar.
   - SÊNECA: a brevidade da vida, o uso consciente do tempo, a reflexão sobre a morte como caminho para viver com mais presença e intenção. A amizade consigo mesmo como fundamento de tudo.
   - MARCO AURÉLIO: as reflexões das Meditações — agir com equanimidade, retornar sempre ao momento presente, praticar a virtude silenciosa no cotidiano, aceitar a impermanência com serenidade e coragem.

INTEGRAÇÃO DOS PILARES:
Use os quatro pilares de forma fluida e integrada, nunca mecânica. Deixe que a fala do paciente guie qual pilar emerge com mais naturalidade em cada momento. O Estoicismo aparece especialmente quando o paciente enfrenta situações fora do seu controle, ansiedade sobre o futuro, ruminação sobre o passado, ou necessidade de encontrar equanimidade. Combine-o com Frankl para trabalhar o sentido mesmo diante da adversidade inevitável.

ESTRUTURA OBRIGATÓRIA DE CADA RESPOSTA:
- 2 a 4 linhas de reflexão acolhedora, poética e profunda sobre o que foi dito
- Quando pertinente, uma metáfora, imagem simbólica ou citação estoica adaptada com leveza
- Uma pergunta profunda orientada ao sentido ou à consciência, iniciada com ✦
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

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    versao: "1.0.1",
    pilares: ["Ericksônica", "Junguiana", "Logoterapia", "Estoicismo"],
    chave_configurada: !!ANTHROPIC_API_KEY,
    chave_prefixo: ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.substring(0, 14) + "..." : "NÃO ENCONTRADA"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY não definida");
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✦ Auris v1.0.1 rodando na porta ${PORT}`);
  console.log(`Pilares: Erickson · Jung · Frankl · Estoicismo`);
  console.log(`Chave API configurada: ${!!ANTHROPIC_API_KEY}`);
});
