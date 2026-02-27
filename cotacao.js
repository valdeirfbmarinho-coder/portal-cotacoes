const API_URL = "https://script.google.com/macros/s/AKfycbyggUvTBjty9B179wuL-fe1q0I4JPtYeFbYfPJWTEc7SiGaANn6pc3JbA7E4ax2VOUn/exec";

// 1. Verifica se o fornecedor realmente fez login
const idFornecedor = localStorage.getItem("fornecedorLogado");
const nomeEmpresa = localStorage.getItem("nomeEmpresa");

if (!idFornecedor) {
    window.location.href = "index.html"; // Expulsa para o login se tentar burlar
}

// Mostra o nome da empresa no cabeçalho
document.getElementById("nomeFornecedor").innerText = nomeEmpresa;

// 2. Botão de Sair
document.getElementById("btnSair").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
});

// 3. Busca os produtos na planilha
function carregarProdutos() {
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ acao: "listar_produtos" })
    })
    .then(res => res.json())
    .then(dados => {
        const tbody = document.querySelector("#tabelaProdutos tbody");
        tbody.innerHTML = ""; // Limpa a mensagem de "Buscando..."

        if(dados.status === "sucesso" && dados.dados.length > 0) {
            // Desenha uma linha na tabela para cada produto retornado
            dados.dados.forEach(produto => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${produto.descricao}</strong> <br><small>Prazo: ${produto.data_limite}</small></td>
                    <td><input type="number" step="0.01" class="preco-input" data-id="${produto.id_produto}" placeholder="Ex: 15.50" required></td>
                    <td><input type="text" class="marca-input" data-id="${produto.id_produto}" placeholder="Nome da marca" required></td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = "<tr><td colspan='3' style='text-align:center;'>Nenhuma cotação aberta no momento.</td></tr>";
            document.getElementById("btnEnviarCotacao").style.display = "none";
        }
    })
    .catch(erro => {
        document.querySelector("#tabelaProdutos tbody").innerHTML = "<tr><td colspan='3' style='text-align:center; color:red;'>Erro ao carregar produtos.</td></tr>";
    });
}

// Inicia a busca assim que a página carrega
carregarProdutos();

// 4. Envia as respostas para a planilha
document.getElementById("formCotacao").addEventListener("submit", function(e) {
    e.preventDefault();
    const btn = document.getElementById("btnEnviarCotacao");
    const aviso = document.getElementById("mensagemAviso");
    
    btn.innerText = "Registrando propostas...";
    btn.disabled = true;

    // Coleta todos os preços e marcas preenchidos
    const precos = document.querySelectorAll(".preco-input");
    const marcas = document.querySelectorAll(".marca-input");
    let respostas = [];

    precos.forEach((inputPreco, index) => {
        respostas.push({
            id_produto: inputPreco.getAttribute("data-id"),
            id_fornecedor: idFornecedor,
            preco: inputPreco.value,
            marca: marcas[index].value
        });
    });

    // Envia os dados para a API
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
            acao: "salvar_respostas",
            respostas: respostas
        })
    })
    .then(res => res.json())
    .then(dados => {
        if(dados.status === "sucesso") {
            aviso.style.color = "#27ae60";
            aviso.innerText = "✅ Cotação enviada com sucesso!";
            // Limpa os campos após o envio
            precos.forEach(p => p.value = "");
            marcas.forEach(m => m.value = "");
        } else {
            aviso.style.color = "#e74c3c";
            aviso.innerText = "❌ Erro: " + dados.mensagem;
        }
        btn.innerText = "Enviar Proposta";
        btn.disabled = false;
    })
    .catch(erro => {
        aviso.style.color = "#e74c3c";
        aviso.innerText = "❌ Erro de conexão ao salvar.";
        btn.innerText = "Enviar Proposta";
        btn.disabled = false;
    });
});