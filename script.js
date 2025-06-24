fetch('criancas.json')
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById('grid-criancas');
    const modal = document.getElementById('modal');
    const form = document.getElementById('form-apadrinhamento');
    const modalNome = document.getElementById('modal-nome');
    const nomeInput = document.getElementById('nome-padrinho');
    const telefoneInput = document.getElementById('telefone-padrinho');
    const cancelar = document.getElementById('cancelar');

    let criancaSelecionada = null;

    // Renderiza os cards das crianças
    data.forEach((crianca, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      if (crianca.apadrinhada) card.classList.add('apadrinhada');

      card.innerHTML = `
        <img src="imagens/${crianca.foto}" alt="Foto de ${crianca.nome}" />
        <h3>${crianca.nome}</h3>
        <p>Idade: ${crianca.idade}</p>
        <p>Altura: ${crianca.altura} m</p>
        <p>Tam. roupa: ${crianca.tam_roupa}</p>
        <p>Tam. calçado: ${crianca.tam_calcado}</p>
        ${!crianca.apadrinhada ? '<button>Quero apadrinhar</button>' : ''}
      `;

      if (!crianca.apadrinhada) {
        const botao = card.querySelector('button');
        botao.addEventListener('click', () => {
          criancaSelecionada = index;
          modal.classList.remove('hidden');
          modalNome.textContent = crianca.nome;
        });
      }

      grid.appendChild(card);
    });

    // Máscara de telefone FUNCIONAL
    telefoneInput.addEventListener('input', () => {
      let valor = telefoneInput.value.replace(/\D/g, '');
      valor = valor.slice(0, 11); // Limita a 11 dígitos

      if (valor.length === 0) {
        telefoneInput.value = '';
      } else if (valor.length <= 2) {
        telefoneInput.value = `(${valor}`;
      } else if (valor.length <= 7) {
        telefoneInput.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
      } else {
        telefoneInput.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
      }
    });

    // Cancelar
    cancelar.addEventListener('click', () => {
      modal.classList.add('hidden');
      nomeInput.value = '';
      telefoneInput.value = '';
    });

    // Submissão do formulário
    form.addEventListener('submit', (e) => {

      form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = nomeInput.value.trim();
  const telefone = telefoneInput.value.trim();
  const telefoneLimpo = telefone.replace(/\D/g, '');

  if (!nome || telefoneLimpo.length !== 11) {
    alert("Preencha seu nome e um telefone válido com DDD e 9 dígitos.");
    return;
  }

  const nomeCrianca = data[criancaSelecionada].nome;

  // SALVA padrinho no padrinhos.json (simulação local)
  fetch("padrinhos.json")
    .then(res => res.json())
    .then(padrinhos => {
      padrinhos.push({
        nome: nome,
        telefone: telefone,
        crianca: nomeCrianca
      });

      // Simulação local: Exibe no console apenas
      console.log("Novo padrinho salvo:", padrinhos[padrinhos.length - 1]);

      // Aqui seria a parte que salva no servidor (próxima etapa com backend)
    });

  alert(`Obrigado, ${nome}! Você apadrinhou ${nomeCrianca}.`);

  const card = document.querySelectorAll('.card')[criancaSelecionada];
  card.classList.add('apadrinhada');
  const botao = card.querySelector('button');
  if (botao) botao.remove();

  modal.classList.add('hidden');
  nomeInput.value = '';
  telefoneInput.value = '';
});

    });
  });
