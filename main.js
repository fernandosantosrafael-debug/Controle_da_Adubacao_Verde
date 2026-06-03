// Função para recalcular as estatísticas baseada nas linhas da tabela
function atualizarEstatisticasTotais() {
    const linhas = document.querySelectorAll('#tabela-registros tbody tr');
    let areaTotal = 0;
    let biomassaTotal = 0;

    linhas.forEach(linha => {
        const areaTexto = linha.querySelector('.col-area').textContent;
        const biomassaTexto = linha.querySelector('.col-biomassa').textContent;

        areaTotal += parseFloat(areaTexto.replace(' ha', '')) || 0;
        biomassaTotal += parseFloat(biomassaTexto.replace(' t', '')) || 0;
    });

    // Atualiza os valores na tela com 1 ou 2 casas decimais
    document.getElementById('total-area').textContent = areaTotal.toFixed(1);
    document.getElementById('total-biomassa').textContent = biomassaTotal.toFixed(2);
}

document.getElementById('form-adubacao').addEventListener('submit', function(e) {
    e.preventDefault();

    const selectCultura = document.getElementById('cultura');
    const inputArea = document.getElementById('area');
    const inputData = document.getElementById('data-plantio');

    const cultura = selectCultura.value;
    const area = parseFloat(inputArea.value);
    const dataFormatada = inputData.value.split('-').reverse().join('/');
    const produtividadePorHectare = parseFloat(selectCultura.options[selectCultura.selectedIndex].getAttribute('data-prod'));
    const biomassaEstimada = (area * produtividadePorHectare).toFixed(1);

    const tabela = document.getElementById('tabela-registros').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();

    novaLinha.setAttribute('data-prod-base', produtividadePorHectare);

    novaLinha.innerHTML = `
        <td class="col-cultura"><strong>${cultura}</strong></td>
        <td class="col-area">${area} ha</td>
        <td class="col-data">${dataFormatada}</td>
        <td class="col-biomassa">${biomassaEstimada} t</td>
        <td>
            <button type="button" class="btn-editar" onclick="editarRegistro(this)">Editar</button>
            <button type="button" class="btn-deletar" onclick="excluirRegistro(this)">Excluir</button>
        </td>
    `;

    document.getElementById('form-adubacao').reset();
    atualizarEstatisticasTotais(); // Atualiza após inserir
});

function excluirRegistro(botao) {
    botao.closest('tr').remove();
    atualizarEstatisticasTotais(); // Atualiza após excluir
}

function editarRegistro(botao) {
    const linha = botao.closest('tr');
    const botaoSalvar = document.querySelector('.btn-salvar');
    
    if (botaoSalvar.textContent === 'Atualizar Plantio') {
        alert('Por favor, salve a edição atual antes de editar outro registro.');
        return;
    }

    const cultura = linha.querySelector('.col-cultura').textContent;
    const areaTexto = linha.querySelector('.col-area').textContent;
    const dataTexto = linha.querySelector('.col-data').textContent;

    const areaNum = parseFloat(areaTexto.replace(' ha', ''));
    const dataInputFormato = dataTexto.split('/').reverse().join('-');

    const selectCultura = document.getElementById('cultura');
    selectCultura.value = cultura;
    document.getElementById('area').value = areaNum;
    document.getElementById('data-plantio').value = dataInputFormato;

    botaoSalvar.textContent = 'Atualizar Plantio';
    document.getElementById('form-adubacao').setAttribute('data-linha-editando', linha.rowIndex);
    linha.style.opacity = '0.5';
}

document.getElementById('form-adubacao').addEventListener('submit', function(e) {
    const botaoSalvar = document.querySelector('.btn-salvar');
    
    if (botaoSalvar.textContent === 'Atualizar Plantio') {
        e.stopImmediatePropagation(); 
        
        const indexLinha = document.getElementById('form-adubacao').getAttribute('data-linha-editando');
        const tabela = document.getElementById('tabela-registros');
        const linha = tabela.rows[indexLinha];

        const selectCultura = document.getElementById('cultura');
        const area = parseFloat(document.getElementById('area').value);
        const dataFormatada = document.getElementById('data-plantio').value.split('-').reverse().join('/');
        const produtividadePorHectare = parseFloat(selectCultura.options[selectCultura.selectedIndex].getAttribute('data-prod'));
        const biomassaEstimada = (area * produtividadePorHectare).toFixed(1);

        linha.setAttribute('data-prod-base', produtividadePorHectare);
        linha.querySelector('.col-cultura').innerHTML = `<strong>${selectCultura.value}</strong>`;
        linha.querySelector('.col-area').textContent = `${area} ha`;
        linha.querySelector('.col-data').textContent = dataFormatada;
        linha.querySelector('.col-biomassa').textContent = `${biomassaEstimada} t`;

        linha.style.opacity = '1';
        botaoSalvar.textContent = 'Registrar Plantio';
        document.getElementById('form-adubacao').removeAttribute('data-linha-editando');
        document.getElementById('form-adubacao').reset();
        
        atualizarEstatisticasTotais(); // Atualiza após editar
    }
}, true);