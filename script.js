const SUPABASE_URL = 'https://retwzkxbuezuznwwejkp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldHd6a3hidWV6dXpud3dlamtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MzIzNjYsImV4cCI6MjA5NzIwODM2Nn0.x1mWOE2fZU34FaqJMF-NOIgwSHyD4AKudZm-f_cTVfg';

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
            return descricao.includes('atleta') || 
                   descricao.includes('jogadora de futebol') || 
                   descricao.includes('futebol');
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
                salvarGemeo(jogador.text, `Nascido em ${dia}/${mes}/${jogador.year} - Destaque do futebol internacional`);
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
        const response = await fetch(`${SUPABASE_URL}/rest/v1/gemeos_salvos`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ nome, detalhes })
        });

        if (response.ok) {
            alert(`${nome} foi escalado e salvo direto na nuvem do Supabase!`);
            carregarGemeos(); 
        } else {
            console.error('Erro na resposta do Supabase:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao registrar na nuvem:', error);
    }
}

async function carregarGemeos() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/gemeos_salvos?select=*&order=data_descoberta.desc`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        const dados = await response.json();
        const lista = document.getElementById('lista-gemeos');
        lista.innerHTML = '';
        
        if (dados.length === 0) {
            lista.innerHTML = '<li class="placeholder">Nenhum craque salvo no banco de nuvem ainda.</li>';
            return;
        }

        dados.forEach(item => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '10px';

            li.innerHTML = `
                <div>
                    <span><strong>${item.nome}</strong></span><br>
                    <span style="font-size: 0.9rem; color: #4b5563;">${item.detalhes}</span><br>
                    <small style="color: #a4b0be;">Escalado em: ${new Date(item.data_descoberta).toLocaleDateString('pt-BR')}</small>
                </div>
            `;

            const botaoDeletar = document.createElement('button');
            botaoDeletar.innerText = '❌ Remover';
            botaoDeletar.style.backgroundColor = '#ff4757';
            botaoDeletar.style.color = 'white';
            botaoDeletar.style.border = 'none';
            botaoDeletar.style.padding = '5px 10px';
            botaoDeletar.style.borderRadius = '4px';
            botaoDeletar.style.cursor = 'pointer';
            botaoDeletar.style.fontSize = '0.85rem';

            botaoDeletar.addEventListener('click', () => {
                if (confirm(`Tem certeza que deseja remover ${item.nome} do seu time?`)) {
                    deletarGemeo(item.id, item.nome);
                }
            });

            li.appendChild(botaoDeletar);
            lista.appendChild(li);
        });
    } catch (error) {
        console.error('Erro de conexão com o banco de nuvem:', error);
    }
}

async function deletarGemeo(id, nome) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/gemeos_salvos?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (response.ok) {
            alert(`${nome} foi removido do seu time na nuvem!`);
            carregarGemeos(); 
        } else {
            console.error('Erro ao deletar no Supabase:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao conectar para deletar:', error);
    }
}

carregarGemeos();
