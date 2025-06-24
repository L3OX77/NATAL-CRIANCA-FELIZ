let data = [];
let criancaSelecionada = null;

// Carrega a lista de crianças do arquivo criancas.json
fetch("criancas.json")
  .then(response => response.json())
  .then(json => {
    data = json;
    carregarLista();
  });

function carregarLista() {
  const lista = document.getElementById("lista-criancas");
  lista.innerHTML = "";

  data.forEach((crianca, index) => {
    const item = document.createElement("div");
    item.classList.add("crianca");

    const status = crianca.apadrinhada ? "✅ Apadrinhada" : "🧒 Disponível";
    const botao = crianca.apadrinhada
      ? `<span style="color: gray;">${status}</span>`
      : `<button onclick="selecionarCrianca(${index})">Apadrinhar</button>`;

    item.innerHTML = `
      <strong>${crianca.nome}</strong><br>
      Idade: ${crianca.idade} anos<br>
      Altura: ${crianca.altura}<br>
      Roupa: ${crianca.tamanho_roupa}<br>
      Calçado: ${crianca.numero_calcado}<br>
      ${botao}
    `;

    lista.appendChild(item);
  });
}

function selecionarCrianca(index) {
  criancaSelecionada = index;
  const form = document.getElementById("form-apadrinhamento");
  form.style.display = "block";

  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";

  document.getElementById("form-titulo").innerText =
    "Apadrinhando: " + data[index].nome;
}

// Máscara de telefone ao digitar
document.getElementById("telefone").addEventListener("input", function (e) {
  let valor = e.target.value.replace(/\D/g, "").slice(0, 11);

  if (valor.length >= 2) valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  if (valor.length >= 10)
    valor = `${valor.slice(0, 10)}-${valor.slice(10)}`;

  e.target.value = valor;
});

document.getElementById("form-apadrinhamento").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !telefone || criancaSelecionada === null) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const nomeCrianca = data[criancaSelecionada].nome;

  // Envia para a planilha via SheetDB
  fetch("https://sheetdb.io/api/v1/bi3l27dr1xwt9", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [{
        nome: nome,
        telefone: telefone,
        crianca: nomeCrianca
      }]
    })
  })
  .then(res => res.json())
  .then(res => {
    if (res.created) {
      alert(`Obrigado, ${nome}! Você apadrinhou ${nomeCrianca}.`);

      // Atualiza visualmente (sem salvar de verdade no criancas.json)
      data[criancaSelecionada].apadrinhada = true;
      carregarLista();
      document.getElementById("form-apadrinhamento").style.display = "none";
    } else {
      alert("Erro ao salvar padrinho. Tente novamente.");
    }
  })
  .catch(() => {
    alert("Erro de conexão com o servidor. Tente novamente.");
  });
});
