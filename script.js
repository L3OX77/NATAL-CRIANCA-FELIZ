const URL = "https://sheetdb.io/api/v1/59vqa5g6txcd4";
let nomeSelecionado = "";

async function carregarCriancas() {
  try {
    const res = await fetch(`${URL}?sheet=criancas`);
    const dados = await res.json();

    const lista = document.getElementById("lista-criancas");
    lista.innerHTML = "";

    dados.forEach(c => {
      if (c.apadrinhada?.toLowerCase() === "sim") return;

      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = c.imagem || "https://via.placeholder.com/150";
      img.alt = c.nome;

      const nome = document.createElement("h3");
      nome.textContent = c.nome;

      const info = document.createElement("p");
      info.innerHTML = `
        Idade: ${c.idade} anos<br>
        Altura: ${c.altura}<br>
        Roupa: ${c.roupa}<br>
        Calçado: ${c.calcado}
      `;

      const botao = document.createElement("button");
      botao.textContent = "Apadrinhar";
      botao.onclick = () => mostrarFormulario(c.nome);

      card.append(img, nome, info, botao);
      lista.appendChild(card);
    });

  } catch (err) {
    console.error("Erro ao carregar:", err);
  }
}

function mostrarFormulario(nome) {
  nomeSelecionado = nome;
  document.getElementById("nome-crianca").textContent = nome;
  document.getElementById("form-container").style.display = "block";
}

document.getElementById("form-apadrinhar").addEventListener("submit", async e => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;

  try {
    await fetch(`${URL}?sheet=padrinhos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [{ nome, telefone }] })
    });

    await fetch(`${URL}/search?sheet=criancas&nome=${nomeSelecionado}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { apadrinhada: "sim" } })
    });

    alert("Apadrinhamento confirmado!");
    document.getElementById("form-apadrinhar").reset();
    document.getElementById("form-container").style.display = "none";
    carregarCriancas();
  } catch (err) {
    console.error("Erro ao apadrinhar:", err);
  }
});

carregarCriancas();