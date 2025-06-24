const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ erro: 'Método não permitido' })
    };
  }

  try {
    const novoPadrinho = JSON.parse(event.body);
    const filePath = path.join(__dirname, '../../padrinhos.json');

    // Lê os padrinhos existentes
    const padrinhosExistentes = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      : [];

    // Adiciona o novo padrinho
    padrinhosExistentes.push(novoPadrinho);

    // Salva o novo arquivo
    fs.writeFileSync(filePath, JSON.stringify(padrinhosExistentes, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ sucesso: true, mensagem: 'Padrinho salvo com sucesso' })
    };

  } catch (erro) {
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: 'Erro ao salvar padrinho', detalhes: erro.message })
    };
  }
};
