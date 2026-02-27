const API_URL = "https://script.google.com/macros/s/AKfycbyggUvTBjty9B179wuL-fe1q0I4JPtYeFbYfPJWTEc7SiGaANn6pc3JbA7E4ax2VOUn/exec";

let todasRespostas = []; 

function carregarMapaPrecos() {
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ acao: "listar_respostas" })
    })
    .then(res => res.json())
    .then(dados => {
        console.log("Dados recebidos da planilha:", dados); // Isso vai aparecer no F12 para nos ajudar!
        
        if(dados.status === "sucesso") {
            todasRespostas = dados.dados;
            desenharTabela(todasRespostas);
        } else {
            alert("Erro ao puxar dados: " + dados.mensagem);
        }
    })
    .catch(erro => {
        console.error("Erro no Fetch:", erro);
        document.querySelector("#tabelaAdmin tbody").innerHTML = "<tr><td colspan='5' style='text-align:center; color:red;'>Falha na comunicação com o banco de dados.</td></tr>";
    });
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
        
        // --- BLINDAGEM CONTRA VÍRGULAS E TEXTOS ---
        let precoFormatado = "0.00";
        try {
            // Transforma o número em texto, troca vírgula por ponto, e depois força a ser número de novo
            let precoLimpo = String(item.preco).replace(',', '.');
            precoFormatado = Number(precoLimpo).toFixed(2);
            
            // Se der NaN (Não é um número), mostra um aviso em vez de travar o site
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
    // Ordenação blindada (ignora textos na hora de calcular)
    const dadosOrdenados = [...todasRespostas].sort((a, b) => {
        let valA = Number(String(a.preco).replace(',', '.'));
        let valB = Number(String(b.preco).replace(',', '.'));
        return (valA || 0) - (valB || 0);
    });
    desenharTabela(dadosOrdenados);
});

document.getElementById("btnSairAdmin").addEventListener("click", () => {
    window.location.href = "index.html";
});

carregarMapaPrecos();