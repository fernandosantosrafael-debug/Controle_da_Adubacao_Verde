document.getElementById('form-adubacao').addEventListener('submit', function(e) {
    e.preventDefault();

    // Captura dos elementos do formulário
    const selectCultura = document.getElementById('cultura');
    const inputArea = document.getElementById('area');
    const inputData = document.getElementById('data-plantio');

    // Valores preenchidos
    const cultura = selectCultura.value;
    const area = parseFloat(inputArea.value);
    
    // Formatação da data para padrão brasileiro (DD/MM/AAAA)
    const dataFormatada = inputData.value.split('-').reverse().join('/');

    // Captura o multiplicador de produtividade (toneladas por hectare) do option selecionado
    const produtividadePorHectare = parseFloat(selectCultura.options[selectCultura.selectedIndex].getAttribute('data-prod'));
    
    // Cálculo da Biomassa Total Estimada
    const biomassaEstimada = (area * produtividadePorHectare).toFixed(1);

    // Criação da nova linha na tabela
    const tabela = document.getElementById('tabela-registros').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();

    novaLinha.innerHTML = `
        <td><strong>${cultura}</strong></td>
        <td>${area} ha</td>
        <td>${dataFormatada}</td>
        <td>${biomassaEstimada} t</td>
        <td><button class="btn-deletar" onclick="excluirRegistro(this)">Excluir</button></td>
    `;

    // Limpa o formulário para o próximo preenchimento
    document.getElementById('form-adubacao').reset();
});

// Função para excluir uma linha da tabela
function excluirRegistro(botao) {
    // Acessa a linha (tr) que contém o botão clicado e a remove
    const linha = botao.parentNode.parentNode;
    linha.remove();
}