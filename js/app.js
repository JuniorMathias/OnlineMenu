$(document).ready(function () {
  cardapio.eventos.init();
})

// aula 1 de js 
var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {
  init: () => {
      cardapio.metodos.obterItensCardapio();
  }
}

cardapio.metodos = {
  //obtem a lista de itens do cardápio e categoria é do cardápio
  obterItensCardapio: (categoria = 'burgers', vermais = false) => {
      var filtro = MENU[categoria];

      if(!vermais){
        $("#itensCardapio").html('');
        $("#btnVerMais").removeClass('hidden');
      }

      $.each(filtro, (i, e) => {
          //linha abaixo está pegando do dados js e trocando o valor e replace com o "E" que é do dados.js e colocando o campo img 
          let temp = cardapio.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.' , ','))
            .replace(/\${id}/g, e.id);

            //verificação de ver mais quando for clicado aula 21
            if(vermais && i >= 8 && i < 12){
              $("#itensCardapio").append(temp);
            }

            //paginação inicial
            if(!vermais && i < 8){
              $("#itensCardapio").append(temp);
            }

      })
      //remover o ativo
      $(".container-menu a").removeClass('active');
      //seta o menu para ativo
      $("#menu-" + categoria).addClass('active');
  },

  //clique do ver mais botão
  verMais:() => {
    //saber qual a opção está ativa da categoria pra poder ver mais 
    var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; //tá pegando o menu dividindo com split e pegando a categoria
    cardapio.metodos.obterItensCardapio(ativo,true);
    $("#btnVerMais").addClass('hidden');
  },

  //diminuir quantidade do cardapio
  diminuirQuantidade: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());
    if(qntdAtual > 0){
      $("#qntd-" + id).text(qntdAtual -1);
    }
  },

  aumentarQuantidade: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());
      $("#qntd-" + id).text(qntdAtual +1);
  },

  //adicionar item ao carrinho o item do cardapio
  adicionarAoCarrinho: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());

    if(qntdAtual > 0){
      //obter a categoria ativa
      var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

      //obtem a lista de itens
      let filtro = MENU[categoria];

      //obtem o item aula 22, o grep é como um each mas retorna um objeto inteiro
      let item = $.grep(filtro, (e , i) => { return e.id == id }); // vai percorrer todos os id's e vai pegar somente o que for igual o que passei no id
      
      if(item.length > 0) {

        //VALIDAR SE JÁ EXISTE ESSE ITEM NO CARRINHO
        let existe = $.grep(MEU_CARRINHO, (elem , index) => { return elem.id == id });

        //caso já exista o item no carrinho só altera a quantidade
        if(existe.length > 0){
          let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
          MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
        }
        //caso não exista o item no carrinho, adiciona ele
        else {
          item[0].qntd = qntdAtual;
          MEU_CARRINHO.push(item[0])
        }

        cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green');
        $("#qntd-" + id).text(0);

        cardapio.metodos.atualizarBadgeTotal();

      }
    }

  },

  //atualiza o total dos Meu carrinho
  atualizarBadgeTotal: () => {
    var total = 0;
    // e é o total que tem no carrinho atualmente
    $.each(MEU_CARRINHO, (i,e) => {
      total += e.qntd
    })
    if(total > 0) {
      $(".botao-carrinho").removeClass("hidden");
      $(".container-total-carrinho").removeClass("hidden");
    }else {
      $(".botao-carrinho").addClass("hidden");
      $(".container-total-carrinho").addClass("hidden");
    }

    //mostra o valor total que foi adicionado no carrinho  aula 23
    $(".badge-total-carrinho").html(total);
  },

  //abrir modal de carrinho aula 23
  abrirCarrinho: (abrir) => {
    if(abrir){
      $("#modalCarrinho").removeClass('hidden');
    } else {
      $("#modalCarrinho").addClass('hidden');
    }

  },

  // altera os textos e exibe os botões das etapas
  carregarEtapa: (etapa) => {
    if(etapa == 1){
      $("#lblTituloEtapa").text('Seu carrinho:');
    }
    if(etapa == 2){
      
    }
    if(etapa == 3){
      
    }
  },


















// mensagem que aparece no alerta
  mensagem: (texto, cor = 'red', tempo = 3500) => {

    //cria um número aleatório e multiplica pela a data atual, id nunca vai se repetir aula 23
    let id = Math.floor(Date.now() * Math.random()).toString();
    
    let msg = ` <div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;
    $("#container-mensagens").append(msg);

    setTimeout(() => {
      $("#msg-" + id).removeClass('fadeInDown');
      $("#msg-" + id).addClass('fadeOutUp');
      setTimeout(() => {
        $("#msg-" + id).remove();
      }, 800)
      
    },tempo);

  }

}

cardapio.templates = {
  item: `
      <div class="col-3 mb-5">
          <div class="card card-item" id="\${id}">
          <div class="img-produto">
              <img src="\${img}" /> 
          </div>
          <p class="title-produto text-center mt-4">
              <b>\${nome}</b>
          </p>
          <p class="price-produto text-center">
              <b>R$ \${preco}</b>
          </p>
          <div class="add-carrinho">
              <span class="btn-menos" onClick="cardapio.metodos.diminuirQuantidade('\${id}')"> <i class="fas fa-minus"> </i></span>
              <span class="add-numero-itens" id="qntd-\${id}"> 0 </span>
              <span class="btn-mais" onClick="cardapio.metodos.aumentarQuantidade('\${id}')"> <i class="fas fa-plus"> </i></span>
              <span class="btn btn-add" onClick="cardapio.metodos.adicionarAoCarrinho('\${id}')"> <i class="fas fa-shopping-bag"> </i></span>
          </div>
          </div>
      </div>
  `
}