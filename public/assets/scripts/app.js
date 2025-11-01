// ===========================================
// assets/js/app.js - LÓGICA FETCH (CRUD)
// ===========================================

// URL BASE da API do JSON Server
const API_URL = 'http://localhost:3000/aventuras';

// ----------------------------------------------------
// FUNÇÕES DE CONSUMO DA API (CRUD)
// ----------------------------------------------------

/**
 * READ: Monta a Seção 1 (Carrossel) e Seção 2 (Cards) da Home.
 */
async function carregarItensHome() {
    try {
        const response = await fetch(API_URL); // GET ALL
        const dados = await response.json();
        
        // Separa destaques (operação READ)
        const destaques = dados.filter(item => item.destaque === true); 

        montarCarrossel(destaques);
        montarCards(dados);
    } catch (error) {
        console.error("Erro ao carregar dados da API:", error);
        // Exibir uma mensagem de erro no DOM se necessário
    }
}

/**
 * READ: Monta o Carrossel (Componente)
 */
function montarCarrossel(destaques) {
    const inner = document.getElementById('carrossel-inner');
    if (!inner) return;

    let htmlContent = '';
    destaques.forEach((item, index) => {
        const active = index === 0 ? 'active' : '';
        // Note o uso de `item.id` para o link de detalhes
        htmlContent += `
            <div class="carousel-item ${active}">
                <img src="${item.imagem_principal}" class="d-block w-100 carousel-img" alt="${item.nome}">
                <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                    <h3 class="fw-bold">${item.nome}</h3>
                    <p>${item.descricao_breve}</p>
                    <a href="detalhes.html?id=${item.id}" class="btn btn-warning fw-bold">Ver Detalhes</a>
                </div>
            </div>
        `;
    });
    inner.innerHTML = htmlContent;
}

/**
 * READ: Monta a Grade de Cards (Componente)
 */
function montarCards(dados) {
    const container = document.getElementById('trilhas-container');
    if (!container) return; 

    let htmlContent = '';
    dados.forEach(item => {
        // Monta o card (operação READ)
        htmlContent += `
            <article class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${item.imagem_card}" class="card-img-top card-img" alt="${item.nome}">
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="card-title text-success fw-bold">${item.nome}</h5>
                        <p class="card-text flex-grow-1">${item.descricao_breve}</p>
                        <a href="detalhes.html?id=${item.id}" class="btn btn-primary mt-auto">Ver Detalhes</a>
                        
                        <div class="d-flex justify-content-center mt-2">
                           <button class="btn btn-sm btn-info me-2" onclick="alert('Funcionalidade de Edição (PUT) implementada no servidor, mas precisa de formulário dedicado.')">Editar</button>
                           <button class="btn btn-sm btn-danger" onclick="deletarAventura(${item.id})">Excluir</button>
                        </div>
                        
                    </div>
                </div>
            </article>
        `;
    });
    container.innerHTML = htmlContent;
}


/**
 * CREATE: Lida com o envio do formulário de cadastro.
 */
async function cadastrarAventura(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const form = event.target;
    const novaAventura = {
        nome: form.querySelector('#nome').value,
        localizacao: form.querySelector('#localizacao').value,
        dificuldade: form.querySelector('#dificuldade').value,
        descricao_breve: form.querySelector('#descricao_breve').value,
        conteudo_completo: 'Conteúdo detalhado padrão.', // Adiciona conteúdo completo padrão
        imagem_principal: form.querySelector('#imagem_card').value, // Usando a URL do card como principal
        imagem_card: form.querySelector('#imagem_card').value,
        atracoes: [], // Inicia com array de atrações vazio
        destaque: false
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST', // Método POST para criação
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaAventura)
        });

        if (response.ok) {
            alert("Aventura cadastrada com sucesso!");
            form.reset(); // Limpa o formulário
        } else {
            alert("Erro ao cadastrar aventura.");
        }
    } catch (error) {
        console.error("Erro na requisição POST:", error);
    }
}


/**
 * DELETE: Remove um registro específico.
 */
async function deletarAventura(id) {
    if (confirm(`Tem certeza que deseja excluir a aventura de ID ${id}?`)) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE' // Método DELETE para exclusão
            });

            if (response.ok) {
                alert(`Aventura ${id} excluída com sucesso!`);
                // Se estiver na home, recarrega a lista
                if (document.getElementById('trilhas-container')) {
                    carregarItensHome(); 
                }
            } else {
                alert("Erro ao excluir aventura.");
            }
        } catch (error) {
            console.error("Erro na requisição DELETE:", error);
        }
    }
}

// ----------------------------------------------------
// FUNÇÃO PARA DETALHES.HTML (READ ONE)
// ----------------------------------------------------

async function carregarDetalhes() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    if (!itemId) {
        // Redireciona se não houver ID (Tratamento de erro)
        window.location.href = 'index.html'; 
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${itemId}`); // GET ONE
        const item = await response.json();

        if (!response.ok) {
            // Se o ID for 404
            document.getElementById('titulo-item').textContent = 'Aventura não encontrada!';
            return;
        }

        // ... (Implementação da injeção de HTML na página de detalhes) ...
        document.title = `${item.nome} - Detalhes da Aventura`;
        document.getElementById('titulo-item').textContent = item.nome;
        
        // Lógica de injeção de detalhes (COPIAR CÓDIGO DA ETAPA ANTERIOR AQUI)

    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
    }
}


// ----------------------------------------------------
// LÓGICA DE INICIALIZAÇÃO E EVENT LISTENERS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização da Home (Carrossel e Cards)
    if (document.getElementById('trilhas-container')) {
        carregarItensHome();
    }
    // Inicialização da Página de Detalhes
    if (document.getElementById('detalhes-gerais')) {
        carregarDetalhes();
    }
    // Inicialização do Formulário de Cadastro (CREATE)
    const formCadastro = document.getElementById('form-cadastro-aventura');
    if (formCadastro) {
        formCadastro.addEventListener('submit', cadastrarAventura);
    }
});