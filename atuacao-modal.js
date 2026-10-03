(() => {
  const modal = document.getElementById("atuacao-modal");
  if (!modal) return;

  const eyebrow = document.getElementById("modal-eyebrow");
  const title = document.getElementById("modal-title");
  const lead = document.getElementById("modal-lead");
  const list = document.getElementById("modal-list");
  const proof = document.getElementById("modal-proof");

  const content = {
    aiqa: {
      eyebrow: "01 · AI QA",
      title: "Qualidade em agentes e conversacional.",
      lead: "Não é demo de prompt. É critério para o que vai a produção: o que o agente faz, o que alucina, o que custa e o que vaza.",
      items: [
        "Evals para agentes, subagentes e fluxos conversacionais — tool use, handoff, loops e memória.",
        "Alucinação, grounding e regressão de diálogo com baseline versionada.",
        "LLM-as-a-judge com rubrica + amostragem humana — escala sem virar teatro.",
        "Red team / adversarial antes do modelo chegar perto do cliente.",
      ],
      proof: "Resultado recente: alucinação de 14% para <1,8%; ciclo de validação +60%; custo de inferência em testes −40%.",
    },
    risk: {
      eyebrow: "02 · Visão de risco",
      title: "O que testar quando o tempo acaba.",
      lead: "Cobertura infinita é fantasia. Eu corto pelo impacto: o que quebra receita, confiança e operação — e deixo o cosmético por último.",
      items: [
        "Matriz de risco com produto e engenharia — severidade × probabilidade × detectabilidade.",
        "Prioridade por caminho crítico: login, pagamento, dados sensíveis, release path.",
        "Sinais de maturidade, incidentes e escapes — o backlog de teste segue a dor, não a checklist.",
        "Decisão explícita do que não testar agora — com dono e data de revisão.",
      ],
      proof: "Uso visão de risco para enxugar regressão e focar esforço onde o escape custa caro — sem teatro de 100% de cobertura.",
    },
    process: {
      eyebrow: "03 · Processo",
      title: "Qualidade que vira ritual do time.",
      lead: "Processo bom cabe numa página e aparece na esteira. Se só vive no Confluence, não existe.",
      items: [
        "Diagnóstico de maturidade: onde dói — flake, escapes, fila de gate, papéis confusos.",
        "Desenho de DoD, critérios de release e papéis — claro o bastante para o squad operar.",
        "Implantação com templates, rituais leves e Shift-Left — adoção mede sucesso.",
        "Medição contínua: o que vira burocracia sai; o que reduz risco fica.",
      ],
      proof: "Ciclo diagnóstico → desenho → implantação → medição implantado com times multi-squad — processo na esteira, não no slide.",
    },
    cloud: {
      eyebrow: "04 · Cloud",
      title: "Qualidade onde a infra responde.",
      lead: "Ambiente compartilhado mentiroso não conta. Testo na nuvem onde latência, escala e falha de serviço aparecem de verdade.",
      items: [
        "AWS, Azure e GCP — clusters, serviços gerenciados e carga distribuída.",
        "Ambientes efêmeros sob demanda (Terraform, Docker, Kubernetes).",
        "Validação de resiliência e comportamento sob degradação real.",
        "Mesmo critério de qualidade na nuvem e na esteira de deploy.",
      ],
      proof: "Inclui campanhas de capacity/stress com k6 distribuído em AWS sob picos de até 50 mil RPS.",
    },
    security: {
      eyebrow: "05 · Segurança e privacidade",
      title: "PII e LGPD no fluxo generativo.",
      lead: "Qualidade sem privacidade é risco jurídico. Coloco controle onde o dado sensível aparece — não só na política.",
      items: [
        "Checagens automatizadas de vazamento de PII em fluxos de IA.",
        "Alinhamento a LGPD em superfícies sensíveis de produto.",
        "Base em formação DPO (EXIN) e Security Foundation (ISO/IEC 27001).",
        "Privacidade como assert de qualidade, não como anexo de compliance.",
      ],
      proof: "Integrei gates de PII nos fluxos generativos/conversacionais do ciclo atual de AI QA.",
    },
    automation: {
      eyebrow: "06 · Automação",
      title: "Automação que o time reutiliza.",
      lead: "Suíte que só o QA entende morre. Padronizo o que escala entre squads — web, mobile e API.",
      items: [
        "Playwright, Appium, Robot Framework, RestAssured — com padrões compartilhados.",
        "E2E e regressão no caminho de receita, não em cosmético.",
        "Taxonomia de flake e saúde de suíte como contrato com o time.",
        "Capacitação junto: automação que o engenheiro consegue estender.",
      ],
      proof: "Em 5 squads: reutilização de ativos de teste +70%; cobertura de automação da regressão 30% → 85%.",
    },
    a11y: {
      eyebrow: "07 · Acessibilidade",
      title: "A11y como gate, não badge.",
      lead: "Se teclado e leitor de tela quebram o caminho crítico, o produto quebrou — mesmo com score verde no Lighthouse.",
      items: [
        "WCAG no fluxo que importa: login, checkout, área logada.",
        "Automatizo o que escala (axe, roles, asserts de nome acessível).",
        "Valido com exploração assistiva o que a ferramenta não vê.",
        "Critério de release com a11y — sem teatro de checklist.",
      ],
      proof: "Trato acessibilidade como risco de produto e qualidade de entrega, no mesmo rigor de regressão e gate.",
    },
    gates: {
      eyebrow: "08 · CI/CD e Quality Gates",
      title: "Proteção sem fila.",
      lead: "Gate que só bloqueia é poder. Gate bom reduz risco e deixa o time seguir com evidência.",
      items: [
        "Camadas: rápido / sob mudança / caro — limiar por risco.",
        "Seleção dinâmica de testes e contract testing (Pact).",
        "Farms e esteiras (GitHub Actions, Azure DevOps, Jenkins).",
        "Bypass auditado e falha com artefato acionável.",
      ],
      proof: "Desenhei gates multi-squad com Pact e seleção dinâmica — regressão automatizada de 30% para 85% sem virar engarrafamento.",
    },
    perf: {
      eyebrow: "09 · Performance",
      title: "p99 na esteira, não no PDF.",
      lead: "Load test de sexta impressiona. Performance contínua protege SLO quando o código muda.",
      items: [
        "Carga, capacity e estresse com leitura de p95/p99.",
        "OpenTelemetry, Grafana e APM correlacionados à jornada.",
        "Baseline e regressão não funcional no pipeline de deploy.",
        "Critério de performance como input de gate — não como relatório solto.",
      ],
      proof: "Campanhas até 50 mil RPS; p99 −45% com diagnóstico OTel/Grafana; regressão não funcional −40% no tempo de ciclo.",
    },
  };

  let lastFocus = null;

  const open = (key) => {
    const data = content[key];
    if (!data) return;
    eyebrow.textContent = data.eyebrow;
    title.textContent = data.title;
    lead.textContent = data.lead;
    list.innerHTML = data.items.map((item) => `<li>${item}</li>`).join("");
    proof.textContent = data.proof;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".modal__close")?.focus();
  };

  const close = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  document.querySelectorAll("[data-atuacao]").forEach((btn) => {
    btn.addEventListener("click", () => {
      lastFocus = btn;
      open(btn.getAttribute("data-atuacao"));
    });
  });

  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
})();
