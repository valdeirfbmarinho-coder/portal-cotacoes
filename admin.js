const API_URL = "https://script.google.com/macros/s/AKfycbyggUvTBjty9B179wuL-fe1q0I4JPtYeFbYfPJWTEc7SiGaANn6pc3JbA7E4ax2VOUn/exec";

if (!localStorage.getItem("adminLogado")) {
    window.location.href = "index.html";
}

let todasRespostas = [];

function carregarMapaPrecos() {
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ acao: "listar_respostas" })
    })
    .then(res => res.json())
    .then(dados => {
        if(dados.status === "sucesso") {
            todasRespostas = dados.dados;
            desenharTabela(todasRespostas);
        }
    });
}

function desenharTabela(dados) {
    const tbody = document.querySelector("#tabelaAdmin tbody");
    tbody.innerHTML = "";
    dados.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.id_produto}</td>
            <td>${item.id_fornecedor}</td>
            <td style="color:#27ae60; font-weight:bold;">R$ ${item.preco}</td>
            <td>${item.marca}</td>
            <td>${item.data}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Botão Exportar (Agora seguro contra erros)
const btnExportar = document.getElementById("btnExportar");
if (btnExportar) {
    btnExportar.addEventListener("click", () => {
        let csvContent = "data:text/csv;charset=utf-8,Cód. Produto;Fornecedor;Preço;Marca;Data\n";
        todasRespostas.forEach(r => {
            csvContent += `${r.id_produto};${r.id_fornecedor};${r.preco};${r.marca};${r.data}\n`;
        });
        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "mapa_precos.csv";
        link.click();
    });
}

document.getElementById("btnSairAdmin").addEventListener("click", () => {
    localStorage.removeItem("adminLogado");
    window.location.href = "index.html";
});

carregarMapaPrecos();
