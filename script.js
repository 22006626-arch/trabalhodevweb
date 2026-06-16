// URL do túnel do Localtunnel que conecta a Vercel ao seu notebook
const API_URL = 'https://all-pugs-walk.loca.lt/api/gemeos';

// LISTA DE PRIORIDADE GIGANTE: Bolas de Ouro, Campeões do Mundo e Astros Internacionais
const superEstrelas = [
    'neymar', 'cristiano ronaldo', 'messi', 'ronaldinho', 'ronaldo', 'kaká', 'benzema', 'modrić', 
    'mbappé', 'haaland', 'lewandowski', 'kane', 'bellingham', 'vinícius', 'vini jr', 'salah', 
    'de bruyne', 'griezmann', 'hazard', 'pogba', 'ibrahimović', 'kroos', 'suárez', 'bale',
    'pelé', 'maradona', 'cruyff', 'zidane', 'rivaldo', 'romário', 'beckenbauer', 
    'buffon', 'casillas', 'iniesta', 'xavi', 'pirlo', 'henry', 'puyol', 'lahm', 'totti',
    'maldini', 'roberto carlos', 'cafu', 'garrincha', 'zico', 'sócrates',
    'casemiro', 'alisson', 'ederson', 'marquinhos', 'thiago silva', 'rodrygo', 'endrick', 
    'son', 'rashford', 'saka', 'foden', 'grealish', 'sterling', 'rooney', 'beckham',
    'müller', 'neuer', 'kimmich', 'reus', 'giroud', 'kanté', 'dembélé',
    'pedri', 'gavi', 'rodri', 'carvajal', 'ramos', 'piqué', 'busquets',
    'di maría', 'lautaro', 'alvarez', 'dybala', 'enzo', 'tevez', 'aguero',
    'leão', 'bruno fernandes', 'bernardo silva', 'joão félix', 'lukaku', 'courtois',
    'marta', 'alexia putellas', 'aitana bonmatí', 'sam kerr', 'morgan', 'rapinoe'
];

// 1. CONSUMO DE API: Captura o Dia/Mês e prioriza os jogadores mais famosos do mundo
document.getElementById('form-busca').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const dia = document.getElementById('dia-nascimento').value;
    const mes = document.getElementById('mes-nascimento').value;
    
    if (!dia || !mes) return;

    const resultadoContainer = document.getElementById('resultado-gemeos');
    resultadoContainer.innerHTML = '<p class="placeholder">Buscando superestrelas do futebol na história...</p>';

    try {
        const response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${mes}/${dia}`);
        const data = await response.json();
        let jogadores = data.births.filter(pessoa => {
            const descricao = pessoa.text.toLowerCase();
            return descricao.includes('footballer') || 
                   descricao.includes('football player') || 
                   descricao.includes('soccer');
        });
        jogadores.sort((a, b) => {
            const nomeA = a.text.toLowerCase();
            const nomeB = b.text.toLowerCase();
            const eEstrelaA = superEstrelas.some(estrela => nomeA.includes(estrela));
            const eEstrelaB = superEstrelas.some(estrela => nomeB.includes(estrela));
            if (eEstrelaA && !eEstrelaB) return -1;
            if (!eEstrelaA && eEstrelaB) return 1;
            return parseInt(b.year) - parseInt(a.year);
        });
        const craquesExibidos = jogadores.slice(0, 4);
        resultadoContainer.innerHTML = ''; 

        if (craquesExibidos.length === 0) {
            resultadoContainer.innerHTML = '<p class="placeholder">Nenhum jogador de futebol de destaque encontrado nesta data.</p>';
            return;
        }
        craquesExibidos.forEach(jogador => {
            const card = document.createElement('div');
            card.className = 'gemeo-card';
            
            const infoDiv = document.createElement('div');
            infoDiv.innerHTML = `<strong>⚽ ${jogador.text}</strong><p style="font-size: 0.9rem; color: #57606f;">Ano de Nascimento: ${jogador.year}</p>`;
            
            const botao = document.createElement('button');
            botao.innerText = ' Escalar para o Meu Time';
            botao.addEventListener('click', () => {
                salvarGemeo(jogador.text, `Jogador de futebol de destaque international, nascido em ${jogador.year}`);
            });

            card.appendChild(infoDiv);
            card.appendChild(botao);
            resultadoContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Erro na requisição externa:', error);
        resultadoContainer.innerHTML = '<p class="placeholder" style="color: #ff4757;">Não foi possível consultar os astros do futebol.</p>';
    }
});

async function salvarGemeo(nome, detalhes) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, detalhes })
        });

        if (response.ok) {
            alert(`${nome} foi salvo no seu banco de dados MySQL!`);
            carregarGemeos(); 
        }
    } catch (error) {
        console.error('Erro ao registrar no backend:', error);
    }
}

async function carregarGemeos() {
    try {
        const response = await fetch(API_URL);
        const dados = await response.json();
        
        const lista = document.getElementById('lista-gemeos');
        textValue = '';
        lista.innerHTML = '';
        
        if (dados.length === 0) {
            lista.innerHTML = '<li class="placeholder">Nenhum craque salvo no banco local ainda.</li>';
            return;
        }

        dados.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${item.nome}</strong> - ${item.detalhes}</span>
                <small style="color: #a4b0be;">Salvo em: ${new Date(item.data_descoberta).toLocaleDateString('pt-BR')}</small>
            `;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error('Erro de conexão com o banco de dados:', error);
    }
}
carregarGemeos();