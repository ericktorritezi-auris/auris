// AURIS v2.0.0 — Gerador de QA Checklist
// Execute: node qa.js
// Output: QA-AURIS-v2.0.0.md

const fs = require('fs');

const qa = `# QA — AURIS v2.0.0
> Quality Assurance Checklist
> Versão: 2.0.0 | Data: ${new Date().toLocaleDateString('pt-BR')} | Autor: Erick Torritezi

---

## 1. Smoke Tests (pré-deploy)

| # | Teste | Esperado | Status |
|---|---|---|---|
| 1.1 | GET / | 200 OK + HTML com "AURIS" no title | ☐ |
| 1.2 | GET /api/health | \`{ status: "ok", versao: "2.0.0" }\` | ☐ |
| 1.3 | GET /privacidade | 200 OK + menção a links externos | ☐ |
| 1.4 | GET /termos | 200 OK + menção a links externos | ☐ |
| 1.5 | POST /api/chat (body mínimo) | 200 + \`content\` não vazio | ☐ |
| 1.6 | POST /api/tts (texto curto) | 200 + \`audioContent\` base64 | ☐ |
| 1.7 | POST /api/nps \`{ score: 9 }\` | 200 OK + gravação no log | ☐ |
| 1.8 | GET /api/nps/stats | 200 + \`{ count, average }\` | ☐ |

---

## 2. Feature Flag Âncora

| # | Teste | ENABLED=false | ENABLED=true |
|---|---|---|---|
| 2.1 | \`#ancora-welcome-wrap\` | \`.hidden\` presente | \`.hidden\` ausente |
| 2.2 | \`#btn-ancora-chat\` (header) | \`.hidden\` presente | \`.hidden\` ausente |
| 2.3 | \`#btn-ancora-summary\` | \`.hidden\` presente | \`.hidden\` ausente |
| 2.4 | \`#ancora-help-wrap\` | \`.hidden\` presente | \`.hidden\` ausente |
| 2.5 | Função \`openAncora()\` chamada | Modal NÃO abre | Modal abre |
| 2.6 | Sugestão inline (\`.ancora-suggestion\`) | Não exibida | Exibida 1× ao detectar palavra-gatilho |

---

## 3. Modal Âncora (somente com ENABLED=true)

| # | Teste | Esperado |
|---|---|---|
| 3.1 | Logo carrega | Imagem base64 visível (180px wide) |
| 3.2 | Título | "Âncora — um passo de cada vez" |
| 3.3 | Botão "Abrir o Âncora" | Abre \`https://ancora.auris.app.br/\` em nova aba |
| 3.4 | Botão "Agendar com Erick" | Abre BellePlanner em nova aba |
| 3.5 | Botão "Continuar no AURIS" | Fecha modal; foco retorna ao acionador |
| 3.6 | Tecla Escape | Fecha modal; foco retorna ao acionador |
| 3.7 | Clique fora do sheet | Fecha modal |
| 3.8 | Links têm referrerpolicy | \`referrerpolicy="no-referrer"\` nos dois links externos |
| 3.9 | Atributos ARIA | \`role="dialog" aria-modal="true" aria-labelledby="ancora-title"\` |
| 3.10 | Notas de rodapé | 2 notas visíveis (adultos / sem compartilhamento automático) |

---

## 4. Fluxo Welcome Screen

| # | Teste | Esperado |
|---|---|---|
| 4.1 | Sem nome → clicar Começar | Alerta "Como posso te chamar?" |
| 4.2 | Sem gênero → clicar Começar | Alerta de gênero |
| 4.3 | Sem faixa etária → clicar Começar | Alerta de faixa etária |
| 4.4 | Enter no campo nome | Aciona startJourney() |
| 4.5 | Ribbon do mês atual | Exibido (ou oculto se fora dos 5 meses) |
| 4.6 | Calendário comemorativo | Aparece se data bater com CAL_DATES |
| 4.7 | CTA Âncora no welcome | Oculto (ENABLED=false) |

---

## 5. Fluxo de Chat

| # | Teste | Esperado |
|---|---|---|
| 5.1 | Mensagem inicial | Exibida em <2s sem erro |
| 5.2 | Envio por Enter | Funciona (Shift+Enter = nova linha) |
| 5.3 | Opções de resposta | 2 botões exibidos após mensagem da IA |
| 5.4 | Clicar opção | Preenche input e envia |
| 5.5 | Microfone (Chrome) | Transcrição aparece no input |
| 5.6 | TTS ♀ | Áudio reproduzido; botão mostra "⏸ pausar" |
| 5.7 | TTS ♂ | Áudio reproduzido; botão mostra "⏸ pausar" |
| 5.8 | 6ª interação | Modal NPS aparece automaticamente |
| 5.9 | Sessão persistida | Recarregar durante sessão = conversa restaurada |

---

## 6. Fluxo de Resumo

| # | Teste | Esperado |
|---|---|---|
| 6.1 | Botão "Ver resumo" | Navega para \`#summary-screen\` |
| 6.2 | Resumo gerado | Texto coerente com conversa em <10s |
| 6.3 | Copiar resumo | Texto copiado para clipboard; botão muda para "Copiado! ✓" |
| 6.4 | CTA Âncora no resumo | Oculto (ENABLED=false) |
| 6.5 | "Nova sessão" sem NPS anterior | Exibe NPS; depois reseta |
| 6.6 | "Nova sessão" com NPS já respondido | Reseta diretamente |
| 6.7 | Botão voltar (←) | Retorna ao chat |

---

## 7. NPS

| # | Teste | Esperado |
|---|---|---|
| 7.1 | Notas 0-8 | Exibe textarea de feedback |
| 7.2 | Notas 9-10 | Oculta textarea |
| 7.3 | Nota 0-8 + texto <50 chars | Alerta de mínimo de caracteres |
| 7.4 | Nota 0-8 + texto ≥50 chars | Permite envio |
| 7.5 | Pular | Fecha modal sem enviar |
| 7.6 | POST /api/nps | Log incrementado |
| 7.7 | Aparece somente 1× por sessão | Não exibe novamente após responder |

---

## 8. Help Panel

| # | Teste | Esperado |
|---|---|---|
| 8.1 | Botão ? (welcome) | Abre help panel |
| 8.2 | Botão 💡 (chat header) | Abre help panel |
| 8.3 | Fechar | Fecha e retorna foco ao acionador |
| 8.4 | Escape | Fecha o painel |
| 8.5 | Clique fora | Fecha o painel |
| 8.6 | Bloco Âncora no help | Oculto (ENABLED=false) |
| 8.7 | Botão Âncora no help | Fecha help e abre modal Âncora (somente ENABLED=true) |

---

## 9. PWA

| # | Teste | Esperado |
|---|---|---|
| 9.1 | /manifest.json | 200 OK + JSON válido |
| 9.2 | /sw.js | 200 OK + registrado pelo browser |
| 9.3 | Banner Android | Aparece em ~3s (somente se não instalado) |
| 9.4 | Aviso iOS | Aparece em ~5s no Safari iOS |
| 9.5 | Instalar → reabrir | Exibe como app standalone |

---

## 10. Acessibilidade

| # | Teste | Esperado |
|---|---|---|
| 10.1 | Modais com role="dialog" | \`ancora-modal\`, \`nps-modal\`, \`help-panel\`, \`calendar-popup\` |
| 10.2 | Todos botões com type="button" | Sem submit acidental |
| 10.3 | \`aria-label\` nos botões de ícone | Microfone, enviar, fechar, ⚓, 💡 |
| 10.4 | \`prefers-reduced-motion\` | Animações desativadas |
| 10.5 | Navegação por teclado | Tab passa por todos os elementos interativos |
| 10.6 | Contraste | Texto sobre fundos (--text/#f5f0e8) ≥ 4.5:1 |

---

## 11. Segurança / Privacidade

| # | Teste | Esperado |
|---|---|---|
| 11.1 | Links externos | \`target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer"\` |
| 11.2 | Nenhum dado enviado a Âncora/Bella automaticamente | Verificar network: zero requisições para esses domínios |
| 11.3 | NPS sem identificação do usuário | Log contém apenas score, feedback e timestamp |
| 11.4 | Conversa não persiste no servidor | Sem gravação em disco além do NPS |
| 11.5 | Chaves de API não expostas no frontend | Nenhuma key no index.html |

---

## 12. Regressão v1.x

| # | Teste | Esperado |
|---|---|---|
| 12.1 | Sistema de ribbons | Ribbon do mês exibido no emblema |
| 12.2 | Calendário comemorativo | Pop-up em datas especiais |
| 12.3 | Vozes TTS gênero-adaptadas | Voz feminina padrão para gênero F |
| 12.4 | Resumo reflexivo | Tom Ericksônico/Jungiano no resumo |
| 12.5 | Opcoes de resposta (2 por turno) | Parseadas do formato "Opção N: texto" |
| 12.6 | sessionStorage | Restaura conversa após F5 dentro da sessão |

---

## Resultado Final

| Categoria | Total | Passaram | Falharam | Bloqueados |
|---|---|---|---|---|
| Smoke Tests | 8 | | | |
| Feature Flag | 6 | | | |
| Modal Âncora | 10 | | | |
| Welcome | 7 | | | |
| Chat | 9 | | | |
| Resumo | 7 | | | |
| NPS | 7 | | | |
| Help | 7 | | | |
| PWA | 5 | | | |
| Acessibilidade | 6 | | | |
| Segurança | 5 | | | |
| Regressão | 6 | | | |
| **TOTAL** | **83** | | | |

---

*AURIS v2.0.0 · QA Checklist · ${new Date().getFullYear()}*
`;

fs.writeFileSync('QA-AURIS-v2.0.0.md', qa, 'utf8');
console.log('✅ QA-AURIS-v2.0.0.md gerado com sucesso!');
console.log('   Tamanho:', fs.statSync('QA-AURIS-v2.0.0.md').size, 'bytes');
