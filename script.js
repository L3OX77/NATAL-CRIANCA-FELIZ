const URL = "https://sheetdb.io/api/v1/59vqa5g6txcd4";
const lista = document.getElementById("lista-criancas");
const formDiv = document.getElementById("form-apadrinhamento");
const nomeSpan = document.getElementById("nome-crianca");
const form = document.getElementById("form");

let nomeCrianca = "";

fetch(`${URL}/sheet/criancas`)
  .then((res) => res.json())
  .then((dados) => {
    lista.innerHTML = "";

    dados.forEach((crianca) => {
      const card = document.createElement("div");
      card.className = "card";

      const imagem = document.createElement("img");
      imagem.src = `imagens/${crianca.imagem || "default.jpg"}`;
      imagem.alt = crianca.nome;

      const nome = document.createElement("h3");
      nome.textContent = crianca.nome;

      const detalhes = document.createElement("p");
      detalhes.innerHTML = `
        Idade: ${crianca.idade || "não informado"} anos<br>
        Altura: ${crianca.altura || "não informado"}<br>
        Roupa: ${crianca.roupa || "não informado"}<br>
        Calçado: ${crianca.calcado || "não informado"}<br>
      `;

      const botao = document.createElement("button");
      botao.textContent = crianca.apadrinhada === "sim" ? "Apadrinhada" : "Apadrinhar";
      botao.disabled = crianca.apadrinhada === "sim";
      botao.style.background = crianca.apadrinhada === "sim" ? "gray" : "green";
      botao.style.color = "white";

      if (crianca.apadrinhada !== "sim") {
        botao.addEventListener("click", () => {
          nomeCrianca = crianca.nome;
          nomeSpan.textContent = nomeCrianca;
          document.getElementById("nomeSelecionado").value = nomeCrianca;
          formDiv.style.display = "block";
          window.scrollTo(0, document.body.scrollHeight);
        });
      }

      card.appendChild(imagem);
      card.appendChild(nome);
      card.appendChild(detalhes);
      card.appendChild(botao);
      lista.appendChild(card);
    });
  });

// Submissão do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;

  // Salvar padrinho
  fetch(`${URL}/sheet/padrinhos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: { nome, telefone, crianca: nomeCrianca },
    }),
  });

  // Atualizar status da criança
  fetch(`${URL}/search?nome=${nomeCrianca}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { apadrinhada: "sim" } }),
  }).then(() => location.reload());

  form.reset();
});
