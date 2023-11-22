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
  obterItensCardapio: (categoria = 'burgers') => {
      var filtro = MENU[categoria];

      $("#itensCardapio").html('');
      $.each(filtro, (i, e) => {
          //linha abaixo está pegando do dados js e trocando o valor e replace com o "E" que é do dados.js e colocando o campo img 
          let temp = cardapio.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.' , ','));

          $("#itensCardapio").append(temp);
      })
      //remover o ativo
      $(".container-menu a").removeClass('active');
      //seta o menu para ativo
      $("#menu-" + categoria).addClass('active');
  },
}

cardapio.templates = {
  item: `
      <div class="col-3 mb-5">
          <div class="card card-item">
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
              <span class="btn-menos"> <i class="fas fa-minus"> </i></span>
              <span class="add-numero-itens"> 0 </span>
              <span class="btn-mais"> <i class="fas fa-plus"> </i></span>
              <span class="btn btn-add"> <i class="fas fa-shopping-bag"> </i></span>
          </div>
          </div>
      </div>
  `
}