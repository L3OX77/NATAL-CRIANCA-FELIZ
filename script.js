const API_CRIANCAS = "https://sheetdb.io/api/v1/59vqa5g6txcd4?sheet=criancas";
const API_PADRINHOS = "https://sheetdb.io/api/v1/59vqa5g6txcd4?sheet=padrinhos";
let nomeSelecionado = "";

async function carregarLista() {
  const resposta = await fetch(API_CRIANCAS);
  const dados = await resposta.json();

  document.getElementById("lista-criancas").innerHTML = "";

  dados.forEach(crianca => {
    document.getElementById("lista-criancas").innerHTML += `
      <div class="crianca">
        <img src="imagens/${crianca.imagem}" alt="${crianca.nome}"><br>
        <strong>${crianca.nome}</strong><br>
        Idade: ${crianca.idade} anos<br>
        Altura: ${crianca.altura}<br>
        Roupa: ${crianca.roupa || 'não informado'}<br>
        Calçado: ${crianca.calcado || 'não informado'}<br>
        ${crianca.apadrinhada?.toLowerCase() === 'sim' ? '<span style="color: green;">✅ Apadrinhada</span>' :
        `<button onclick="mostrarFormulario('${crianca.nome}')">Apadrinhar</button>`}
      </div>
    `;
  });
}

function mostrarFormulario(nome) {
  nomeSelecionado = nome;
  document.getElementById("form-apadrinhamento").style.display = "block";
  document.getElementById("form-titulo").innerText = `Apadrinhar ${nome}`;
}

document.getElementById("telefone").addEventListener("input", function (e) {
  let valor = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (valor.length > 2 && valor.length <= 7)
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  else if (valor.length > 7)
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
  e.target.value = valor;
});

document.getElementById("form-apadrinhamento").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nomePadrinho = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;

  // Salva os dados do padrinho
  await fetch(API_PADRINHOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [{
        nome: nomePadrinho,
        telefone: telefone,
        crianca: nomeSelecionado
      }]
    })
  });

  // Atualiza status da criança para apadrinhada
  await fetch(`${API_CRIANCAS}/nome/${nomeSelecionado}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        apadrinhada: "sim"
      }
    })
  });

  alert(`Obrigado por apadrinhar ${nomeSelecionado}!`);

  document.getElementById("form-apadrinhamento").reset();
  document.getElementById("form-apadrinhamento").style.display = "none";

  carregarLista();
});

carregarLista();
