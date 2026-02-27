// URL da sua API no Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbyggUvTBjty9B179wuL-fe1q0I4JPtYeFbYfPJWTEc7SiGaANn6pc3JbA7E4ax2VOUn/exec";

document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que a página recarregue
    
    const codigo = document.getElementById('codigo').value;
    const senha = document.getElementById('senha').value;
    const btnEntrar = document.getElementById('btnEntrar');
    const divErro = document.getElementById('mensagemErro');
    
    // Feedback visual de carregamento
    btnEntrar.innerText = "Validando...";
    btnEntrar.disabled = true;
    divErro.style.display = "none";

    // Monta o pacote de dados para enviar à API
    const dadosEnvio = {
        acao: "login",
        id_fornecedor: codigo,
        senha: senha
    };

    // Faz a chamada para a sua planilha do Google
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(dadosEnvio)
    })
    .then(resposta => resposta.json())
    .then(dados => {
        if(dados.status === "sucesso") {
            // Salva os dados do fornecedor no navegador e vai para a cotação
            localStorage.setItem("fornecedorLogado", codigo);
            localStorage.setItem("nomeEmpresa", dados.empresa);
            window.location.href = "cotacao.html"; 
        } else {
            // Mostra o erro (ex: senha incorreta)
            divErro.innerText = dados.mensagem;
            divErro.style.display = "block";
            btnEntrar.innerText = "Entrar no Painel";
            btnEntrar.disabled = false;
        }
    })
    .catch(erro => {
        divErro.innerText = "Erro ao conectar com o servidor.";
        divErro.style.display = "block";
        btnEntrar.innerText = "Entrar no Painel";
        btnEntrar.disabled = false;
    });
});