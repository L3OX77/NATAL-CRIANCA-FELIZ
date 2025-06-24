const SENHA_CORRETA = "admin123"; // você pode trocar por outra

function verificarSenha() {
  const senha = document.getElementById("senha").value;
  if (senha === SENHA_CORRETA) {
    document.getElementById("tela-login").classList.add("hidden");
    document.getElementById("painel").classList.remove("hidden");
    carregarCriancas();
  } else {
    alert("Senha incorreta!");
  }
}

function carregarCriancas() {
  fetch("../criancas.json")
    .then(res => res.json())
    .then(criancas => {
      const tabela = document.getElementById("tabela-criancas");
      tabela.innerHTML = "";

      criancas.forEach((c, i) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${c.nome}</td>
          <td>${c.apadrinhada ? "Sim" : "Não"}</td>
          <td>
            <button onclick="alternarStatus(${i}, ${c.apadrinhada})">
              ${c.apadrinhada ? "Desmarcar" : "Marcar"}
            </button>
            <button onclick="verPadrinho(${i})">Ver Padrinho</button>
          </td>
        `;
        tabela.appendChild(linha);
      });
    });
}

function alternarStatus(index, statusAtual) {
  fetch("../criancas.json")
    .then(res => res.json())
    .then(criancas => {
      criancas[index].apadrinhada = !statusAtual;

      fetch("../criancas.json", {
        method: "PUT", // Para usar localmente é só simular
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(criancas, null, 2)
      });

      alert("Status atualizado (simulado).");
      carregarCriancas();
    });
}

function verPadrinho(index) {
  fetch("../padrinhos.json")
    .then(res => res.json())
    .then(padrinhos => {
      const crianca = document.querySelectorAll("#tabela-criancas tr")[index].children[0].textContent;
      const padrinho = padrinhos.find(p => p.crianca === crianca);

      if (padrinho) {
        alert(`Padrinho: ${padrinho.nome}\nTelefone: ${padrinho.telefone}`);
      } else {
        alert("Nenhum padrinho encontrado para esta criança.");
      }
    });
}
