const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const versao = '2.0.0';
const DATA_DIR = process.env.DATA_DIR || './data';
const NPS_FILE = path.join(DATA_DIR, 'nps_log.txt');

// Garante diretório de dados
if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Rotas legais ───────────────────────────────────────────────────────────

app.get('/privacidade', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Política de Privacidade — AURIS</title>
<style>
  body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #333; line-height: 1.7; background: #faf8f4; }
  h1 { color: #2c2c2c; border-bottom: 2px solid #b8972a; padding-bottom: 8px; }
  h2 { color: #4a4a4a; margin-top: 2em; }
  a { color: #b8972a; }
  .back { display: inline-block; margin-top: 2em; color: #b8972a; text-decoration: none; }
</style>
</head>
<body>
<h1>Política de Privacidade — AURIS</h1>
<h2>1. Dados Coletados</h2>
<p>Podem ser tratados dados fornecidos diretamente pelo usuário durante a interação, incluindo informações relacionadas ao estado emocional.</p>
<h2>2. Base Legal</h2>
<p>O tratamento ocorre mediante consentimento do usuário (art. 7º, I da LGPD).</p>
<h2>3. Finalidade</h2>
<p>Os dados são utilizados exclusivamente para o funcionamento da plataforma e a geração de respostas personalizadas.</p>
<h2>4. Compartilhamento</h2>
<p>Os dados podem ser processados por provedores de tecnologia (ex: APIs de inteligência artificial), podendo envolver transferência internacional.</p>
<h2>5. Armazenamento</h2>
<p>O sistema prioriza não retenção de dados, podendo utilizar armazenamento temporário local no dispositivo do usuário.</p>
<h2>6. Links Externos</h2>
<p>Esta plataforma pode exibir links para serviços externos (Âncora, Bella – Terapia Evolutiva). Cada serviço possui seus próprios termos e política de privacidade. O clique em um link externo não compartilha automaticamente o conteúdo da conversa com o serviço de destino.</p>
<h2>7. Direitos do Usuário</h2>
<p>O usuário pode, a qualquer momento, solicitar informações sobre o tratamento de dados ou revogar o consentimento.</p>
<h2>8. Segurança</h2>
<p>São adotadas medidas técnicas para proteção dos dados.</p>
<h2>9. Contato</h2>
<p>erick.torritezi@gmail.com</p>
<a href="/" class="back">← Voltar ao AURIS</a>
</body>
</html>`);
});

app.get('/termos', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Termos de Uso — AURIS</title>
<style>
  body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #333; line-height: 1.7; background: #faf8f4; }
  h1 { color: #2c2c2c; border-bottom: 2px solid #b8972a; padding-bottom: 8px; }
  h2 { color: #4a4a4a; margin-top: 2em; }
  a { color: #b8972a; }
  .back { display: inline-block; margin-top: 2em; color: #b8972a; text-decoration: none; }
</style>
</head>
<body>
<h1>Termos de Uso — AURIS</h1>
<h2>1. Natureza do Serviço</h2>
<p>O AURIS é uma plataforma digital de apoio ao autoconhecimento e desenvolvimento pessoal, baseada em inteligência artificial cognitiva.</p>
<p>O serviço não constitui, sob nenhuma hipótese: psicoterapia, atendimento psicológico, diagnóstico clínico ou tratamento de saúde mental.</p>
<h2>2. Limitações de Uso</h2>
<p>O usuário reconhece que o serviço não substitui profissionais de saúde e não deve ser utilizado em situações de crise emocional grave. Em casos de sofrimento intenso, recomenda-se buscar ajuda profissional ou serviços especializados como o CVV (188).</p>
<h2>3. Uso de Inteligência Artificial</h2>
<p>As interações são geradas por sistemas automatizados e podem conter imprecisões. O usuário é responsável pela interpretação e uso das informações.</p>
<h2>4. Links Externos</h2>
<p>Esta plataforma pode oferecer acesso a serviços externos complementares (como o Âncora e a Bella – Terapia Evolutiva). Esses serviços são independentes e possuem seus próprios termos de uso. O AURIS não realiza integração de dados clínicos, transferência de prontuário ou sincronização de sessões com esses serviços.</p>
<h2>5. Responsabilidade</h2>
<p>O serviço é fornecido "como está", não havendo garantia de resultados específicos.</p>
<h2>6. Privacidade</h2>
<p>O tratamento de dados segue a Política de Privacidade disponível na plataforma.</p>
<h2>7. Aceite</h2>
<p>Ao utilizar o serviço, o usuário declara estar ciente e de acordo com estes termos.</p>
<a href="/" class="back">← Voltar ao AURIS</a>
</body>
</html>`);
});

// ─── API Chat ────────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const { messages, name, gender, ageRange } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages inválido' });
  }

  const genderMap = { M: 'masculino', F: 'feminino', NB: 'não-binário', PNR: 'prefere não responder' };
  const ageMap = {
    '0-20': '0 a 20 anos', '21-35': '21 a 35 anos',
    '36-50': '36 a 50 anos', '51+': '51 anos ou mais'
  };
  const gStr = genderMap[gender] || 'não informado';
  const aStr = ageMap[ageRange] || 'não informada';

  const systemPrompt = `Você é AURIS, uma presença de apoio ao autoconhecimento e desenvolvimento pessoal. Você não é terapeuta, psicólogo nem médico — é uma plataforma digital de reflexão guiada por IA cognitiva.

Você está conversando com ${name || 'o usuário'} (gênero: ${gStr}; faixa etária: ${aStr}).

SEU PROPÓSITO É PROMOVER AUTOCONHECIMENTO PROFUNDO. Você se apoia em seis pilares:
1. Hipnose Ericksoniana — metáforas, linguagem suave, scripts hipnóticos conversacionais
2. Psicologia Profunda (Jung) — padrões inconscientes, individuação, símbolos
3. Logoterapia (Frankl) — sentido, propósito existencial, responsabilidade pela própria vida
4. Sabedoria Estoica — foco no que se controla, equanimidade, força interior
5. PNL (Bandler & Grinder) — reframing, crenças limitantes, âncoras emocionais
6. Direcionamento Humanizado (Rogers) — escuta ativa, aceitação incondicional, congruência

PRINCÍPIOS DE PROFUNDIDADE:
- NUNCA aceite respostas superficiais sem aprofundar genuinamente
- RECUSE-SE a permanecer na superfície — toda resposta deve mover algo
- OBSERVE padrões ao longo da conversa e nomeie-os com cuidado
- FAÇA perguntas de desconforto produtivo — as que a pessoa evita
- TENHA intenção clara em cada resposta
- RESPONSABILIZE-SE pelo resultado transformador da conversa
- NUNCA confirme crenças limitantes — ofereça perspectivas alternativas

LINGUAGEM:
- Adapte ao perfil: gênero e faixa etária informados
- Use linguagem fluida, sem jargões clínicos
- Metáforas vívidas e diretas ao ponto
- Perguntas abertas e precisas

REGRA CRÍTICA — OPÇÕES DE RESPOSTA:
- Sempre ofereça EXATAMENTE 2 opções coerentes com a pergunta feita
- As opções devem ser respostas reais, não direções genéricas
- Exemplo: se perguntar "o que pesa mais: X ou Y?", as opções são "X" e "Y"
- NUNCA ofereça opções como "Sim" e "Não" para perguntas abertas

POSICIONAMENTO LEGAL — OBRIGATÓRIO:
- Você é uma plataforma digital de apoio ao autoconhecimento — NUNCA se posicione como serviço terapêutico
- Sem diagnósticos, sem linguagem clínica estruturada
- Em situações de risco REAL (ideação suicida, abuso em curso, transtorno severo, sofrimento paralisante): indique o CVV (188) E ofereça o link para conhecer o trabalho de Erick Torritezi (https://linktr.ee/ericktorritezi)
- NÃO indicar para: tristeza comum, conflitos do dia a dia, ansiedade cotidiana, luto normal, autoconhecimento
- Sempre oferecer opção de continuar com AURIS mesmo ao indicar apoio externo

FORMATO DE RESPOSTA:
- Resposta principal: 1 a 3 parágrafos densos e precisos
- Ao final, em nova linha, sempre: "**Opção 1:** [texto]" e "**Opção 2:** [texto]"
- Sem asteriscos duplos dentro das opções além do marcador
- Sem emojis`;

  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages
    });

    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Erro ao processar mensagem', details: err.message });
  }
});

// ─── API Summary ─────────────────────────────────────────────────────────────

app.post('/api/summary', async (req, res) => {
  const { messages, name, gender, ageRange } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages inválido' });
  }

  const summaryPrompt = `Você é AURIS. Crie um resumo reflexivo e transformador desta conversa com ${name || 'o usuário'}.

O resumo deve:
- Capturar os temas centrais que emergiram
- Nomear padrões identificados sem linguagem clínica
- Destacar insights e movimentos de consciência
- Finalizar com uma pergunta ou convite para reflexão contínua
- Tom: acolhedor, direto, sem superficialidade
- Extensão: 3 a 5 parágrafos

NÃO inclua opções de resposta. Este é um documento de reflexão pessoal.`;

  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: summaryPrompt,
      messages: messages
    });

    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ error: 'Erro ao gerar resumo', details: err.message });
  }
});

// ─── API TTS ─────────────────────────────────────────────────────────────────

app.post('/api/tts', async (req, res) => {
  const { text, voice } = req.body;
  if (!text) return res.status(400).json({ error: 'texto obrigatório' });

  const TTS_KEY = process.env.GOOGLE_TTS_KEY;
  if (!TTS_KEY) return res.status(500).json({ error: 'TTS não configurado' });

  // Sanitiza e prepara SSML
  const sanitized = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*/g, '').replace(/\*/g, '')
    .replace(/Opção \d+:/gi, '')
    .trim();

  const ssml = `<speak>${sanitized.replace(/\.\s+/g, '. <break time="400ms"/>').replace(/\?\s+/g, '? <break time="500ms"/>').replace(/!\s+/g, '! <break time="400ms"/>')}</speak>`;

  const isFemale = voice === 'F';
  const voiceName = isFemale ? 'pt-BR-Neural2-C' : 'pt-BR-Neural2-B';
  const pitch = isFemale ? 0.8 : -1.0;
  const rate = isFemale ? 1.02 : 1.0;

  const payload = {
    input: { ssml },
    voice: { languageCode: 'pt-BR', name: voiceName },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: rate,
      pitch: pitch,
      effectsProfileId: ['headphone-class-device']
    }
  };

  try {
    const https = require('https');
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'texttospeech.googleapis.com',
      path: `/v1/text:synthesize?key=${TTS_KEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };

    const ttsReq = https.request(options, (ttsRes) => {
      let body = '';
      ttsRes.on('data', chunk => body += chunk);
      ttsRes.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.audioContent) {
            res.json({ audioContent: parsed.audioContent });
          } else {
            console.error('TTS sem audioContent:', body);
            res.status(500).json({ error: 'TTS falhou', details: body });
          }
        } catch (e) {
          res.status(500).json({ error: 'TTS parse error' });
        }
      });
    });
    ttsReq.on('error', e => res.status(500).json({ error: e.message }));
    ttsReq.write(data);
    ttsReq.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API NPS ──────────────────────────────────────────────────────────────────

app.post('/api/nps', (req, res) => {
  const { score, feedback } = req.body;
  if (score === undefined || score === null || score < 0 || score > 10) {
    return res.status(400).json({ error: 'score inválido (0-10)' });
  }

  const needsFeedback = score <= 8;
  if (needsFeedback && feedback && (feedback.length < 50 || feedback.length > 500)) {
    return res.status(400).json({ error: 'feedback deve ter 50 a 500 caracteres' });
  }

  const line = feedback
    ? `${new Date().toISOString()}|${score}|${feedback.replace(/\n/g, ' ')}\n`
    : `${new Date().toISOString()}|${score}\n`;

  try {
    fs.appendFileSync(NPS_FILE, line, 'utf8');
    res.json({ ok: true });
  } catch (err) {
    console.error('NPS write error:', err);
    res.status(500).json({ error: 'Erro ao salvar NPS' });
  }
});

app.get('/api/nps/stats', (req, res) => {
  try {
    if (!fs.existsSync(NPS_FILE)) return res.json({ total: 0, score: null, promoters: 0, neutrals: 0, detractors: 0, entries: [] });

    const lines = fs.readFileSync(NPS_FILE, 'utf8').split('\n').filter(Boolean);
    const entries = lines.map(l => {
      const parts = l.split('|');
      return { date: parts[0], score: parseInt(parts[1]), feedback: parts[2] || null };
    }).filter(e => !isNaN(e.score));

    const total = entries.length;
    if (total === 0) return res.json({ total: 0, score: null, promoters: 0, neutrals: 0, detractors: 0, entries: [] });

    const promoters = entries.filter(e => e.score >= 9).length;
    const detractors = entries.filter(e => e.score <= 6).length;
    const neutrals = total - promoters - detractors;
    const nps = Math.round(((promoters - detractors) / total) * 100);

    res.json({ total, score: nps, promoters, neutrals, detractors, entries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/nps/download', (req, res) => {
  try {
    if (!fs.existsSync(NPS_FILE)) return res.status(404).send('Nenhum dado NPS');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="nps_log.txt"');
    res.send(fs.readFileSync(NPS_FILE, 'utf8'));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ─── NPS Dashboard ────────────────────────────────────────────────────────────

app.get('/nps', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AURIS — Dashboard NPS</title>
<link rel="icon" type="image/png" sizes="32x32" href="/nps-icon-32.png">
<link rel="apple-touch-icon" href="/nps-icon-180.png">
<link rel="manifest" href="/nps-manifest.json">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', sans-serif; background: #1a1a2e; color: #e8e0d0; min-height: 100vh; padding: 20px; }
  .header { text-align: center; padding: 30px 0 20px; }
  .header h1 { font-size: 1.8rem; color: #d4a853; letter-spacing: 3px; }
  .header p { color: #9a8870; font-size: 0.9rem; margin-top: 5px; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; max-width: 700px; margin: 0 auto 30px; }
  .card { background: #2a2a3e; border-radius: 12px; padding: 20px; text-align: center; }
  .card .num { font-size: 2.5rem; font-weight: 700; }
  .card .label { font-size: 0.75rem; color: #9a8870; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }
  .semaforo { font-size: 3rem; }
  .entries { max-width: 700px; margin: 0 auto; }
  .entry { background: #2a2a3e; border-radius: 8px; padding: 12px 15px; margin-bottom: 8px; display: flex; gap: 15px; align-items: flex-start; }
  .entry .score { font-size: 1.4rem; font-weight: 700; min-width: 35px; text-align: center; }
  .entry .meta { flex: 1; }
  .entry .date { font-size: 0.75rem; color: #9a8870; }
  .entry .fb { font-size: 0.85rem; color: #c8b898; margin-top: 4px; font-style: italic; }
  .btn { display: inline-block; background: #d4a853; color: #1a1a2e; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 10px 5px; font-size: 0.85rem; }
  .actions { text-align: center; margin: 20px 0; }
  .verde { color: #4caf50; } .amarelo { color: #ffc107; } .vermelho { color: #f44336; }
  .p { color: #4caf50; } .n { color: #ffc107; } .d { color: #f44336; }
</style>
</head>
<body>
<div class="header">
  <h1>AURIS</h1>
  <p>Dashboard NPS · v${versao}</p>
</div>
<div id="dashboard"><p style="text-align:center;color:#9a8870">Carregando...</p></div>
<script>
fetch('/api/nps/stats').then(r=>r.json()).then(d=>{
  if(!d.total){document.getElementById('dashboard').innerHTML='<p style="text-align:center;color:#9a8870;padding:40px">Nenhuma avaliação ainda.</p>';return;}
  const sc = d.score;
  const cor = sc>=70?'verde':sc>=30?'amarelo':'vermelho';
  const emoji = sc>=70?'🟢':sc>=30?'🟡':'🔴';
  let html = \`<div class="cards">
    <div class="card"><div class="num \${cor}">\${sc}</div><div class="label">NPS Score</div><div class="label">(meta: 70)</div></div>
    <div class="card"><div class="semaforo">\${emoji}</div><div class="label">Semáforo</div></div>
    <div class="card"><div class="num">\${d.total}</div><div class="label">Respostas</div></div>
    <div class="card"><div class="num p">\${d.promoters}</div><div class="label">Promotores</div></div>
    <div class="card"><div class="num n">\${d.neutrals}</div><div class="label">Neutros</div></div>
    <div class="card"><div class="num d">\${d.detractors}</div><div class="label">Detratores</div></div>
  </div>
  <div class="actions"><a class="btn" href="/api/nps/download">⬇ Baixar Log</a><a class="btn" href="/">← AURIS</a></div>
  <div class="entries">\`;
  d.entries.slice().reverse().forEach(e=>{
    const c = e.score>=9?'p':e.score<=6?'d':'n';
    const dt = new Date(e.date).toLocaleString('pt-BR');
    html += \`<div class="entry"><div class="score \${c}">\${e.score}</div><div class="meta"><div class="date">\${dt}</div>\${e.feedback?'<div class="fb">'+e.feedback+'</div>':''}</div></div>\`;
  });
  html += '</div>';
  document.getElementById('dashboard').innerHTML = html;
});
</script>
</body>
</html>`);
});

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  let npsCount = 0;
  try {
    if (fs.existsSync(NPS_FILE)) {
      npsCount = fs.readFileSync(NPS_FILE, 'utf8').split('\n').filter(Boolean).length;
    }
  } catch (e) {}

  res.json({
    status: 'ok',
    versao,
    nps_entries: npsCount,
    data_dir: DATA_DIR,
    timestamp: new Date().toISOString()
  });
});

// ─── Frontend ─────────────────────────────────────────────────────────────────

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AURIS v${versao} rodando na porta ${PORT}`);
});
