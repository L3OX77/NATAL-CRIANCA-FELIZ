const SHEETDB_URL = 'https://sheetdb.io/api/v1/59vqa5g6txcd4';

document.addEventListener("DOMContentLoaded", () => {
    const listaCriancas = document.getElementById("lista-criancas");
    const formContainer = document.getElementById("form-container");
    const form = document.getElementById("form-apadrinhar");
    const nomeCriancaSpan = document.getElementById("nome-crianca");

    let criancaSelecionada = null;

    async function carregarCriancas() {
        try {
            const response = await fetch(`${SHEETDB_URL}/sheet/criancas`);
            const data = await response.json();

            listaCriancas.innerHTML = "";

            data.forEach(crianca => {
                const card = document.createElement("div");
                card.className = "card";

                const imagem = document.createElement("img");
                imagem.src = crianca.imagem || "default.jpg";
                imagem.alt = crianca.nome;

                const nome = document.createElement("h3");
                nome.textContent = crianca.nome;

                const idade = document.createElement("p");
                idade.textContent = `Idade: ${crianca.idade || "não informado"} anos`;

                const altura = document.createElement("p");
                altura.textContent = `Altura: ${crianca.altura || "não informado"}`;

                const roupa = document.createElement("p");
                roupa.textContent = `Roupa: ${crianca.roupa || "não informado"}`;

                const calcado = document.createElement("p");
                calcado.textContent = `Calçado: ${crianca.calcado || "não informado"}`;

                const botao = document.createElement("button");
                botao.textContent = crianca.apadrinhada === "sim" ? "Apadrinhada" : "Apadrinhar";
                botao.disabled = crianca.apadrinhada === "sim";
                botao.className = crianca.apadrinhada === "sim" ? "btn-apadrinhada" : "btn-apadrinhar";

                botao.addEventListener("click", () => {
                    criancaSelecionada = crianca;
                    nomeCriancaSpan.textContent = crianca.nome;
                    formContainer.style.display = "block";
                    form.reset();
                });

                card.appendChild(imagem);
                card.appendChild(nome);
                card.appendChild(idade);
                card.appendChild(altura);
                card.appendChild(roupa);
                card.appendChild(calcado);
                card.appendChild(botao);

                listaCriancas.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao carregar crianças:", error);
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nomePadrinho = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;

        if (!criancaSelecionada) return;

        try {
            // 1. Adiciona padrinho
            await fetch(`${SHEETDB_URL}/sheet/padrinhos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data: {
                        nome_padrinho: nomePadrinho,
                        telefone,
                        crianca: criancaSelecionada.nome
                    }
                })
            });

            // 2. Atualiza status da criança
            await fetch(`${SHEETDB_URL}/sheet/criancas/nome/${criancaSelecionada.nome}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: { apadrinhada: "sim" } })
            });

            alert("Apadrinhamento realizado com sucesso!");
            formContainer.style.display = "none";
            await carregarCriancas(); // atualiza a lista
        } catch (error) {
            console.error("Erro ao registrar apadrinhamento:", error);
            alert("Erro ao registrar apadrinhamento.");
        }
    });

    carregarCriancas();
});
