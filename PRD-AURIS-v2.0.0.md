# PRD — AURIS v2.0.0
> Product Requirements Document
> Versão: 2.0.0 | Data: 11/11/2026 | Autor: Erick Torritezi

---

## 1. Visão Geral

**AURIS** (Agente Terapêutico de IA Cognitiva) é uma Progressive Web App (PWA) de autoconhecimento guiado. A versão **2.0.0** introduz a integração com **Âncora** (plataforma de experiências interativas para pausa e presença) e com o **assistente virtual Bella** (agendamento via BellePlanner), além de consolidar melhorias de acessibilidade, TTS neural e persistência de NPS.

---

## 2. Objetivos

| Objetivo | Métrica de sucesso |
|---|---|
| Integrar Âncora como complemento terapêutico | 6 pontos de entrada implementados |
| Oferecer agendamento via Bella (BellePlanner) | Link funcional no modal Âncora |
| Manter privacidade: nenhum dado enviado automaticamente | Zero requisições automáticas a Âncora/Bella |
| Suportar habilitação futura por feature flag | `ANCORA_CFG.ENABLED` = false por padrão |
| TTS Neural2 (Google Cloud) | Vozes pt-BR-Neural2-B e pt-BR-Neural2-C |
| NPS persistente (append-only) | Arquivo `data/nps_log.txt` no Railway volume |

---

## 3. Escopo da v2.0.0

### 3.1 Integração Âncora (6 pontos de entrada)

Todos os pontos ficam **ocultos** enquanto `ANCORA_CFG.ENABLED = false`.

| # | Local | Elemento | Comportamento |
|---|---|---|---|
| 1 | Welcome screen | Botão "Conhecer o Âncora" abaixo do CTA principal | Abre modal Âncora |
| 2 | Header do chat | Ícone ⚓ (`#btn-ancora-chat`) | Abre modal Âncora |
| 3 | Chat (inline) | `.ancora-suggestion` — sugestão contextual 1×/sessão | Detecta palavras-chave (pausa, respirar, descanso…) |
| 4 | Resumo | Botão "Quer fazer uma pausa com o Âncora?" | Abre modal Âncora |
| 5 | Modal Âncora | Logo + descrição + 3 ações | Abre Âncora / Bella / fecha |
| 6 | Help panel | Bloco `#ancora-help-wrap` | Descrição + botão de acesso |

### 3.2 Modal Âncora

- Logo oficial (PNG 180×116px, base64 inline)
- Título: "Âncora — um passo de cada vez"
- 2 notas de rodapé (adultos / sem compartilhamento automático)
- Ação primária: Abrir o Âncora (`https://ancora.auris.app.br/`)
- Ação secundária: Agendar com Erick via Bella (`https://terapiaevolutiva.belleplanner.com.br/chat`)
- Ação terciária: Continuar no AURIS (fecha modal)
- Links: `target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer"`

### 3.3 Acessibilidade do Modal

- `role="dialog" aria-modal="true" aria-labelledby="ancora-title"`
- Escape fecha o modal; foco retorna ao elemento acionador
- Todos os botões têm `type="button"`

### 3.4 Função `applyAncora()`

Chamada no carregamento da página. Adiciona/remove classe `.hidden` nos 6 elementos Âncora com base em `ANCORA_CFG.ENABLED`.

### 3.5 Detecção Contextual (`shouldSuggestAncora`)

Palavras-gatilho: pausa, descanso, descansar, pausar, respirar, respiro, atividade, interativo, algo diferente, exercício, prática.
Exibe `.ancora-suggestion` apenas 1× por sessão.

---

## 4. Backend (server.js)

| Rota | Método | Descrição |
|---|---|---|
| `/` | GET | SPA — retorna `public/index.html` |
| `/privacidade` | GET | Política de Privacidade (atualizada com seção de links externos) |
| `/termos` | GET | Termos de Uso (atualizado com seção de links externos) |
| `/api/chat` | POST | Claude claude-haiku-4-5-20251001, max_tokens 1000, system prompt integrado |
| `/api/summary` | POST | Claude claude-haiku-4-5-20251001, max_tokens 2000, resumo reflexivo |
| `/api/tts` | POST | Google Cloud TTS Neural2 (pt-BR-Neural2-B/C), SSML |
| `/api/nps` | POST | Append em `DATA_DIR/nps_log.txt` |
| `/api/nps/stats` | GET | Contagem e média NPS |
| `/api/nps/download` | GET | Download do log NPS (texto) |
| `/api/health` | GET | Status, versão, contagem NPS, diretório de dados |
| `/nps` | GET | Dashboard HTML interno (NPS) |

### Modelos de IA

- Chat/resumo: `claude-haiku-4-5-20251001`
- TTS: Google Cloud Text-to-Speech Neural2
  - Feminino: `pt-BR-Neural2-C`
  - Masculino: `pt-BR-Neural2-B`

---

## 5. Frontend (public/index.html)

### 5.1 Telas

| Tela | ID | Descrição |
|---|---|---|
| Boas-vindas | `#welcome-screen` | Nome, gênero, faixa etária + CTA Âncora (oculto) |
| Chat | `#chat-screen` | Mensagens, input, TTS, opções, botão resumo |
| Resumo | `#summary-screen` | Texto gerado, copiar, CTA Âncora (oculto), nova sessão |

### 5.2 Painéis e Modais

| Modal/Painel | ID | Descrição |
|---|---|---|
| Ajuda | `#help-panel` | Sheet inferior com itens explicativos + bloco Âncora (oculto) |
| NPS | `#nps-modal` | Escala 0-10 + feedback textual (mín. 50 chars para 0-8) |
| Âncora | `#ancora-modal` | Logo + descrição + ações (oculto por padrão) |
| Calendário | `#calendar-popup` | Datas comemorativas com pergunta reflexiva |

### 5.3 CSS Variables (tema)

```css
--bg: #f5f0e8  --bg2: #ece7de  --gold: #b8972a  --gold2: #d4a853
--text: #2c2412  --text2: #5a4e38  --text3: #8a7c62
--ag (Âncora green): #1a5245  --at (Âncora teal): #2d7a62  --agold: #c8a84b
```

### 5.4 Ribbons Mensais

| Mês | Ribbon | Cor |
|---|---|---|
| Janeiro (1) | Janeiro Branco | Branco |
| Agosto (8) | Agosto Lilás | Lilás |
| Setembro (9) | Setembro Amarelo | Amarelo |
| Outubro (10) | Outubro Rosa | Rosa |
| Novembro (11) | Novembro Azul | Azul |

Ribbons embutidos como base64 PNG 50×50px no objeto JS `RIBBONS`.

---

## 6. PWA

- `manifest.json`: nome, ícones 192px e 180px, display standalone
- `sw.js` v2.0.0: cache estático (stale-while-revalidate), API calls = network-only
- Banner de instalação: Android (beforeinstallprompt) e iOS (share sheet)

---

## 7. Privacidade e Dados

- Conversas: **não são armazenadas no servidor**; vivem somente no `sessionStorage` do navegador
- NPS: append-only em volume persistente do Railway (`DATA_DIR/nps_log.txt`)
- Links externos (Âncora, Bella): abrem em nova aba; **nenhum dado é enviado automaticamente**
- `referrerpolicy="no-referrer"` em todos os links externos

---

## 8. Feature Flag Âncora

```js
const ANCORA_CFG = {
  ENABLED: false,         // ← manter false até DNS + HTTPS + autorização confirmados
  URL: 'https://ancora.auris.app.br/',
  BELLA: 'https://terapiaevolutiva.belleplanner.com.br/chat'
};
```

Para ativar: alterar `ENABLED: true` e fazer deploy. Não requer mudanças estruturais.

---

## 9. Variáveis de Ambiente (Railway)

| Variável | Uso |
|---|---|
| `ANTHROPIC_API_KEY` | Autenticação Claude |
| `GOOGLE_TTS_KEY` | Autenticação Google Cloud TTS |
| `DATA_DIR` | Caminho do volume persistente (default: `./data`) |
| `PORT` | Porta (Railway injeta automaticamente) |

---

## 10. Checklist de Entrega v2.0.0

- [x] `server.js` — backend completo com rotas /privacidade e /termos atualizadas
- [x] `public/index.html` — frontend com 6 pontos de integração Âncora (todos ocultos)
- [x] `public/manifest.json` — PWA manifest atualizado
- [x] `public/sw.js` — Service Worker v2.0.0
- [x] `package.json` — versão 2.0.0
- [ ] Deploy no Railway
- [ ] Validar `/api/health` → `{ versao: "2.0.0" }`
- [ ] Confirmar DNS + HTTPS do Âncora com Erick
- [ ] Ativar `ANCORA_CFG.ENABLED = true` após confirmação

---

*AURIS v2.0.0 · Erick Torritezi · 2026*
