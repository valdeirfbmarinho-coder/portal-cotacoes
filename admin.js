// Trava de segurança: Se não tiver logado como admin, expulsa para o login
if (!localStorage.getItem("adminLogado")) {
    window.location.href = "index.html";
}

const API_URL = "https://script.google.com/macros/s/AKfycbyggUvTBjty9B179wuL-fe1q0I4JPtYeFbYfPJWTEc7SiGaANn6pc3JbA7E4ax2VOUn/exec";

let todasRespostas = []; 

function carregarMapaPrecos() {
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ acao: "listar_respostas" })
    })
    .then(res => res.json())
    .then(dados => {
        if(dados.status === "sucesso") {
            todasRespostas = dados.dados;
            desenharTabela(todasRespostas);
        } else {
            alert("Erro ao puxar dados: " + dados.mensagem);
        }
    })
    .catch(erro => console.error("Erro no Fetch:", erro));
}

function desenharTabela(dadosParaDesenhar) {
    const tbody = document.querySelector("#tabelaAdmin tbody");
    tbody.innerHTML = "";

    if (!dadosParaDesenhar || dadosParaDesenhar.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>Nenhuma cotação recebida ainda.</td></tr>";
        return;
    }

    dadosParaDesenhar.forEach(item => {
        const tr = document.createElement("tr");
        let precoFormatado = "0.00";
        try {
            let precoLimpo = String(item.preco).replace(',', '.');
            precoFormatado = Number(precoLimpo).toFixed(2);
            if (isNaN(precoFormatado)) precoFormatado = "Valor Inválido";
        } catch(e) {
            precoFormatado = "Erro";
        }

        tr.innerHTML = `
            <td><strong>${item.id_produto}</strong></td>
            <td>${item.id_fornecedor}</td>
            <td style="color: #27ae60; font-weight: bold;">R$ ${precoFormatado}</td>
            <td>${item.marca}</td>
            <td><small>${item.data}</small></td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById("btnOrdenarMenor").addEventListener("click", () => {
    const dadosOrdenados = [...todasRespostas].sort((a, b) => {
        let valA = Number(String(a.preco).replace(',', '.'));
        let valB = Number(String(b.preco).replace(',', '.'));
        return (valA || 0) - (valB || 0);
    });
    desenharTabela(dadosOrdenados);
});

// Botão de Exportar para Excel
document.getElementById("btnExportar").addEventListener("click", () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Cód. Produto;Cód. Fornecedor;Preço (R$);Marca;Data do Envio\n";
    
    const linhasTabela = document.querySelectorAll("#tabelaAdmin tbody tr");
    linhasTabela.forEach(linha => {
        const colunas = linha.querySelectorAll("td");
        if (colunas.length === 5) { 
            let idProd = colunas[0].innerText;
            let idForn = colunas[1].innerText;
            let preco = colunas[2].innerText.replace("R$ ", "").trim(); 
            let marca = colunas[3].innerText;
            let data = colunas[4].innerText;
            
            let linhaCsv = `${idProd};${idForn};${preco};${marca};${data}`;
            csvContent += linhaCsv + "\n";
        }
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_cotacoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Sair (Limpando a sessão do Admin)
document.getElementById("btnSairAdmin").addEventListener("click", () => {
    localStorage.removeItem("adminLogado");
    window.location.href = "index.html";
});

carregarMapaPrecos();
