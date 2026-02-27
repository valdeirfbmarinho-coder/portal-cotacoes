const API_URL = "https://script.google.com/macros/s/AKfycbyggUvTBjty9B179wuL-fe1q0I4JPtYeFbYfPJWTEc7SiGaANn6pc3JbA7E4ax2VOUn/exec";
const idForn = localStorage.getItem("fornecedorLogado");

if (!idForn) window.location.href = "index.html";

function carregarProdutos() {
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ acao: "listar_produtos" })
    })
    .then(res => res.json())
    .then(dados => {
        const tbody = document.querySelector("#tabelaProdutos tbody");
        tbody.innerHTML = "";
        dados.dados.forEach(p => {
            tbody.innerHTML += `
                <tr>
                    <td>${p.nome}</td>
                    <td><input type="number" step="0.01" class="preco-input" data-id="${p.id}"></td>
                    <td><input type="text" class="marca-input"></td>
                </tr>`;
        });
    });
}

document.getElementById("formCotacao").addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = document.getElementById("btnEnviarCotacao");
    btn.disabled = true;
    
    let respostas = [];
    document.querySelectorAll(".preco-input").forEach((input, i) => {
        const marca = document.querySelectorAll(".marca-input")[i].value;
        if (input.value) {
            respostas.push({
                id_produto: input.dataset.id,
                id_fornecedor: idForn,
                preco: input.value,
                marca: marca
            });
        }
    });

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ acao: "salvar_respostas", respostas: respostas })
    })
    .then(() => {
        alert("Cotação enviada!");
        location.reload();
    });
});

carregarProdutos();
