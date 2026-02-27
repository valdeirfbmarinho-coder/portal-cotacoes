const API_URL = "https://script.google.com/macros/s/AKfycbyggUvTBjty9B179wuL-fe1q0I4JPtYeFbYfPJWTEc7SiGaANn6pc3JbA7E4ax2VOUn/exec";

// Muda os textos da tela quando o usuário escolhe Admin ou Fornecedor
document.getElementById('tipoAcesso').addEventListener('change', function(e) {
    const labelCodigo = document.querySelector('label[for="codigo"]');
    if(e.target.value === 'admin') {
        labelCodigo.innerText = 'Usuário Admin';
        document.getElementById('codigo').placeholder = 'Seu usuário da equipe';
    } else {
        labelCodigo.innerText = 'Código do Fornecedor';
        document.getElementById('codigo').placeholder = 'Ex: FORN001';
    }
});

document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const tipo = document.getElementById('tipoAcesso').value;
    const codigo = document.getElementById('codigo').value;
    const senha = document.getElementById('senha').value;
    const btnEntrar = document.getElementById('btnEntrar');
    const divErro = document.getElementById('mensagemErro');
    
    btnEntrar.innerText = "Validando...";
    btnEntrar.disabled = true;
    divErro.style.display = "none";

    const dadosEnvio = {
        acao: "login",
        tipo: tipo,
        id: codigo,
        senha: senha
    };

    // CORREÇÃO: Adicionado Content-Type text/plain para evitar erro de CORS do Google
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(dadosEnvio)
    })
    .then(resposta => resposta.json())
    .then(dados => {
        if(dados.status === "sucesso") {
            if(dados.perfil === "admin") {
                localStorage.setItem("adminLogado", codigo);
                window.location.href = "admin.html";
            } else {
                localStorage.setItem("fornecedorLogado", codigo);
                localStorage.setItem("nomeEmpresa", dados.empresa);
                window.location.href = "cotacao.html";
            }
        } else {
            divErro.innerText = dados.mensagem;
            divErro.style.display = "block";
            btnEntrar.innerText = "Entrar no Painel";
            btnEntrar.disabled = false;
        }
    })
    .catch(erro => {
        divErro.innerText = "Erro ao conectar com o servidor. Verifique a URL do Google Sheets.";
        divErro.style.display = "block";
        btnEntrar.innerText = "Entrar no Painel";
        btnEntrar.disabled = false;
        console.error(erro);
    });
});
