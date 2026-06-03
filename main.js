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

    // Guardamos o valor da produtividade por hectare como um atributo na linha para usar na edição posterior
    novaLinha.setAttribute('data-prod-base', produtividadePorHectare);

    novaLinha.innerHTML = `
        <td class="col-cultura"><strong>${cultura}</strong></td>
        <td class="col-area">${area} ha</td>
        <td class="col-data">${dataFormatada}</td>
        <td class="col-biomassa">${biomassaEstimada} t</td>
        <td>
            <button class="btn-editar" onclick="editarRegistro(this)">Editar</button>
            <button class="btn-deletar" onclick="excluirRegistro(this)">Excluir</button>
        </td>
    `;

    document.getElementById('form-adubacao').reset();
});

function excluirRegistro(botao) {
    botao.closest('tr').remove();
}

function editarRegistro(botao) {
    const linha = botao.closest('tr');
    const botaoSalvar = document.querySelector('.btn-salvar');
    
    // Se o usuário já estiver editando algo, evita bugar o sistema
    if (botaoSalvar.textContent === 'Atualizar Plantio') {
        alert('Por favor, salve a edição atual antes de editar outro registro.');
        return;
    }

    // Captura os dados textuais da linha selecionada
    const cultura = linha.querySelector('.col-cultura').textContent;
    const areaTexto = linha.querySelector('.col-area').textContent;
    const dataTexto = linha.querySelector('.col-data').textContent;

    // Extrai apenas os números da área (remove o ' ha')
    const areaNum = parseFloat(areaTexto.replace(' ha', ''));
    
    // Converte a data de DD/MM/AAAA de volta para AAAA-MM-DD para o input do HTML
    const dataInputFormato = dataTexto.split('/').reverse().join('-');

    // Preenche o formulário lá em cima com os dados dessa linha
    const selectCultura = document.getElementById('cultura');
    selectCultura.value = cultura;
    document.getElementById('area').value = areaNum;
    document.getElementById('data-plantio').value = dataInputFormato;

    // Transforma o botão do formulário em um botão de "Atualizar"
    botaoSalvar.textContent = 'Atualizar Plantio';
    
    // Guarda a referência da linha que está sendo editada no próprio formulário
    document.getElementById('form-adubacao').setAttribute('data-linha-editando', linha.rowIndex);

    // Desativa temporariamente a linha na tabela visualmente
    linha.style.opacity = '0.5';
}

// Modificação no evento de Submit para entender se está Salvando Novo ou Atualizando Existente
document.getElementById('form-adubacao').addEventListener('submit', function(e) {
    const botaoSalvar = document.querySelector('.btn-salvar');
    
    if (botaoSalvar.textContent === 'Atualizar Plantio') {
        // Interrompe o fluxo normal de criar uma nova linha
        e.stopImmediatePropagation(); 
        
        const indexLinha = document.getElementById('form-adubacao').getAttribute('data-linha-editando');
        const tabela = document.getElementById('tabela-registros');
        const linha = tabela.rows[indexLinha];

        const selectCultura = document.getElementById('cultura');
        const area = parseFloat(document.getElementById('area').value);
        const dataFormatada = document.getElementById('data-plantio').value.split('-').reverse().join('/');
        const produtividadePorHectare = parseFloat(selectCultura.options[selectCultura.selectedIndex].getAttribute('data-prod'));
        const biomassaEstimada = (area * produtividadePorHectare).toFixed(1);

        // Atualiza os campos daquela linha específica
        linha.setAttribute('data-prod-base', produtividadePorHectare);
        linha.querySelector('.col-cultura').innerHTML = `<strong>${selectCultura.value}</strong>`;
        linha.querySelector('.col-area').textContent = `${area} ha`;
        linha.querySelector('.col-data').textContent = dataFormatada;
        linha.querySelector('.col-biomassa').textContent = `${biomassaEstimada} t`;

        // Restaura o formulário e o botão ao estado original
        linha.style.opacity = '1';
        botaoSalvar.textContent = 'Registrar Plantio';
        document.getElementById('form-adubacao').removeAttribute('data-linha-editando');
        document.getElementById('form-adubacao').reset();
    }
}, true);