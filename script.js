const API_CRIANCAS = "https://sheetdb.io/api/v1/59vqa5g6txcd4?sheet=criancas";
const API_PADRINHOS = "https://sheetdb.io/api/v1/59vqa5g6txcd4?sheet=padrinhos";

async function carregarLista() {
  const resposta = await fetch(API_CRIANCAS);
  const dados = await resposta.json();

  const lista = document.getElementById("lista-criancas");
  lista.innerHTML = "";

  dados.forEach(crianca => {
    const item = document.createElement("div");
    item.className = "card";

    const imagem = crianca.imagem
      ? `<img src="imagens/${crianca.imagem}" alt="${crianca.nome}" class="foto">`
      : "";

    const nome = crianca.nome || "Nome não informado";
    const idade = crianca.idade ? `${crianca.idade} anos` : "não informado";
    const altura = crianca.altura || "não informado";
    const roupa = crianca.roupa || "não informado";
    const calcado = crianca.calcado || "não informado";

    let botao;
    if (crianca.apadrinhada?.toLowerCase() === "sim") {
      botao = `<button class="apadrinhada" disabled>✅ Apadrinhada</button>`;
    } else {
      botao = `<button class="btn-apadrinhar" data-nome="${crianca.nome}">Apadrinhar</button>`;
    }

    item.innerHTML = `
      ${imagem}
      <strong>${nome}</strong><br>
      Idade: ${idade}<br>
      Altura: ${altura}<br>
      Roupa: ${roupa}<br>
      Calçado: ${calcado}<br>
      ${botao}
    `;

    lista.appendChild(item);
  });

  adicionarEventosBotoes();
}

function adicionarEventosBotoes() {
  const botoes = document.querySelectorAll(".btn-apadrinhar");

  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      const nomeSelecionado = botao.getAttribute("data-nome");

      document.getElementById("nome-crianca").textContent = nomeSelecionado;
      document.getElementById("form-apadrinhamento").style.display = "block";
      document.getElementById("nome").focus();
      document.getElementById("nomeSelecionado").value = nomeSelecionado;
    });
  });
}

document.getElementById("form-apadrinhamento").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const nomeCrianca = document.getElementById("nomeSelecionado").value;

  if (!nome || !telefone) {
    alert("Preencha todos os campos.");
    return;
  }

  // 1. Envia dados para a aba "padrinhos"
  await fetch(API_PADRINHOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        nome,
        telefone,
        crianca: nomeCrianca
      }
    })
  });

  // 2. Atualiza o status de apadrinhamento da criança
  await fetch(`${API_CRIANCAS}/search?nome=${encodeURIComponent(nomeCrianca)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        apadrinhada: "sim"
      }
    })
  });

  document.getElementById("form-apadrinhamento").reset();
  document.getElementById("form-apadrinhamento").style.display = "none";

  await carregarLista();
});

// Máscara de telefone com limite de caracteres
const telefoneInput = document.getElementById("telefone");

telefoneInput.addEventListener("input", () => {
  let valor = telefoneInput.value.replace(/\D/g, "");

  if (valor.length > 11) valor = valor.slice(0, 11);

  if (valor.length <= 2) {
    valor = `(${valor}`;
  } else if (valor.length <= 7) {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  } else {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
  }

  telefoneInput.value = valor;
});

// Inicia
carregarLista();
