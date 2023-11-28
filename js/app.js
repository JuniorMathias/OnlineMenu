$(document).ready(function () {
  cardapio.eventos.init();
})

// aula 1 de js 
var cardapio = {};

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
              <span class="btn btn-add"> <i class="fas fa-shopping-bag"> </i></span>
          </div>
          </div>
      </div>
  `
}