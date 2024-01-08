$(document).ready(function () {
  cardapio.eventos.init();
})

// aula 1 de js 
var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;
var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;
var CELULAR_EMPRESA = '5585991956331';
var QUEIJAO = 1;

function formatarTelefone(input) {
  let numeroLimpo = input.value.replace(/\D/g, '');
  let numeroFormatado = `(${numeroLimpo.slice(0, 2)}) ${numeroLimpo.slice(2, 6)}-${numeroLimpo.slice(6, 10)}`;
  input.value = numeroFormatado;
}
function validarNumero(event) {
  const codigoTecla = event.keyCode || event.which;
  if (codigoTecla >= 48 && codigoTecla <= 57) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

cardapio.eventos = {
  init: () => {
      cardapio.metodos.obterItensCardapio();
      cardapio.metodos.carregarBotaoReserva();
      cardapio.metodos.carregarBotaoLigar();
      cardapio.metodos.carregarBotaoWpp();
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
            .replace(/\${id}/g, e.id)
            .replace(/\${ingredientes}/g, e.ingredientes);

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
      cardapio.metodos.carregarCarrinho();
    } else {
      $("#modalCarrinho").addClass('hidden');
    }

  },

  // altera os textos e exibe os botões das etapas aula 24 
  carregarEtapa: (etapa) => {
    if(etapa == 1){
      $("#lblTituloEtapa").text('Seu carrinho:');
      $("#itensCarrinho").removeClass('hidden');
      $("#localEntrega").addClass('hidden');
      $("#resumoCarrinho").addClass('hidden');

      $(".etapa").removeClass('active');
      $(".etapa1").addClass('active');

      $("#btnEtapaPedido").removeClass('hidden');
      $("#btnEtapaEndereco").addClass('hidden');
      $("#btnEtapaResumo").addClass('hidden');
      $("#btnVoltar").addClass('hidden');
    }
    if(etapa == 2){
      $("#lblTituloEtapa").text('Endereço de entrega:');
      $("#itensCarrinho").addClass('hidden');
      $("#localEntrega").removeClass('hidden');
      $("#resumoCarrinho").addClass('hidden');

      $(".etapa").removeClass('active');
      $(".etapa1").addClass('active');
      $(".etapa2").addClass('active');

      $("#btnEtapaPedido").addClass('hidden');
      $("#btnEtapaEndereco").removeClass('hidden');
      $("#btnEtapaResumo").addClass('hidden');
      $("#btnVoltar").removeClass('hidden');
      
    }
    if(etapa == 3){
      $("#lblTituloEtapa").text('Resumo do pedido:');
      $("#itensCarrinho").addClass('hidden');
      $("#localEntrega").addClass('hidden');
      $("#resumoCarrinho").removeClass('hidden');

      $(".etapa").removeClass('active');
      $(".etapa1").addClass('active');
      $(".etapa2").addClass('active');
      $(".etapa3").addClass('active');

      $("#btnEtapaPedido").addClass('hidden');
      $("#btnEtapaEndereco").addClass('hidden');
      $("#btnEtapaResumo").removeClass('hidden');
      $("#btnVoltar").removeClass('hidden');
    }
  },

  //botão de voltar etapas
  voltarEtapa: () => {
    // essa let etapa vai ver qual .etapa.active está marcado acima e vai ver o tamanho dela aula 24
    let etapa = $(".etapa.active").length;
    cardapio.metodos.carregarEtapa(etapa -1);
  },

  //carrega a lista de itens do carrinho no modal aula 25
  carregarCarrinho: () => {
    cardapio.metodos.carregarEtapa(1);

    if(MEU_CARRINHO.length > 0){
      $("#itensCarrinho").html('');

      //pega o elemento atual do meu carrinho cria a var e altera de acordo com o q vier no array no template itemCarrinho
      $.each(MEU_CARRINHO, (i, e) => {
        let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
        .replace(/\${nome}/g, e.name)
        .replace(/\${preco}/g, e.price.toFixed(2).replace('.' , ','))
        .replace(/\${id}/g, e.id)
        .replace(/\${qntd}/g, e.qntd);

        $("#itensCarrinho").append(temp);
        //último item do carrinho aula 26
        if((i+1) == MEU_CARRINHO.length){
          cardapio.metodos.carrgarValores();
        }
      })

    } else {
      $("#itensCarrinho").html('<p class="carrinho-vazio"> <i class="fa fa-shopping-bag"></i>Seu carrinho está vazio.</p>');
      cardapio.metodos.carrgarValores();
    }
  },
  //aula 25 diminuir a quantidade do modal para o carrinho
  diminuirQuantidadeCarrinho: (id) => {
    let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

    if(qntdAtual > 1){

      $("#qntd-carrinho-" + id).text(qntdAtual -1);
      cardapio.metodos.atualizarCarrinho(id, qntdAtual -1);

    } else {
      cardapio.metodos.removerItemCarrinho(id);
    }

  },

  //aula 25 aumentar a quantidade do modal para o carrinho
  aumentarQuantidadeCarrinho: (id) => {
    let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
    $("#qntd-carrinho-" + id).text(qntdAtual + 1);
    cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

  },

  // botão remover item do carrinho
  removerItemCarrinho: (id) => {
    //mmeu carrinho é filtrado, e retorna o que não tem o id, ele retira 
    MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
    cardapio.metodos.carregarCarrinho();
    cardapio.metodos.atualizarBadgeTotal();

  },
  //atualiza o carrinho com a quantidade atual aula 25 todo abaixo metodo atualizarcarrinho
  atualizarCarrinho: (id, qntd) => {
    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
    MEU_CARRINHO[objIndex].qntd = qntd;

    //atualiza o botão carrinho com a quantidade atualizada
    cardapio.metodos.atualizarBadgeTotal();
    //atualiza os valores totais do carrinho
    cardapio.metodos.carrgarValores();
  },

  // aula 26 carrega os valores do subtotal, entrega e total
  carrgarValores: () => {
    VALOR_CARRINHO = 0;
  
    $("#lblSubTotal").text('R$ 0,00');
    $("#lblValorEntrega").text('+ R$ 0,00');
    $("#lblValorTotal").text('R$ 0,00');

    $.each(MEU_CARRINHO, (i,e) => {
      VALOR_CARRINHO += parseFloat(e.price * e.qntd);

      $("#queijo-" + e.id).on("change", function() {
        // Get the checkbox state
        var isChecked = $(this).is(":checked");
  
        // Update the total based on the checkbox state
        if (isChecked) {
          // If checked, increase the total value by the value of QUEIJAO
          VALOR_CARRINHO += QUEIJAO;
        } else {
          // If unchecked, decrease the total value by the value of QUEIJAO
          VALOR_CARRINHO -= QUEIJAO;
        }
  
        // Update the displayed values
        $("#lblSubTotal").text(`R$ ${(VALOR_CARRINHO).toFixed(2).replace('.', ',')}`);
        $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
      });
    

      if((i + 1) == MEU_CARRINHO.length) {
        $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
        $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
        $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
      }
    })

  },

  carregarEndereco: () => {
    if(MEU_CARRINHO.length <= 0){
      cardapio.metodos.mensagem(`Seu carrinho está vazio`);
      return;
    }
    cardapio.metodos.carregarEtapa(2);
  },
  //API VIA CEP
  buscarCep: () => {
    //cria a variavel com o valor do cep
    var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

    if(cep != "") {
      //expressão regular para validar o cep
      var validacep = /^[0-9]{8}$/;

      if(validacep.test(cep)) {
        $.getJSON("http://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados){

          if(!("erro" in dados)) {
            //Atualizar os campos com os valores retornados
            $("#txtEndereco").val(dados.logradouro);
            $("#txtBairro").val(dados.bairro);
            $("#txtCidade").val(dados.localidade);
            $("#ddlUf").val(dados.uf);
            $("#txtNumero").focus();

          }else {
            cardapio.metodos.mensagem(`CEP não encontrado. Preencha as informações manualmente.`);
            $("#txtEndereco").focus();
          }

        })

      }else{
        cardapio.metodos.mensagem(`Formato do CEP inválido.`);
        $("#txtCEP").focus();
      }



    } else {
      cardapio.metodos.mensagem(`Informe o CEP, por favor.`);
      $("#txtCEP").focus();
    }
  },

  //validação antes de prosseguir para a etapa 3
  resumoPedido: () => {
    var nome = $("#txtNome").val().trim();
    var telefone = $("#txtTelefone").val().trim().replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    var cep = $("#txtCEP").val().trim();
    var endereco = $("#txtEndereco").val().trim()
    var bairro = $("#txtBairro").val().trim()
    var cidade = $("#txtCidade").val().trim()
    var uf = $("#ddlUf").val().trim()
    var numero = $("#txtNumero").val().trim()
    var complemento = $("#txtComplemento").val().trim()

    if(nome.length <= 0) {
      cardapio.metodos.mensagem(`Informe o seu Nome, por favor.`);
      $("#txtNome").focus();
      return;
    }
    if(telefone.length <= 0) {
      cardapio.metodos.mensagem(`Informe o seu Telefone, por favor.`);
      $("#txtTelefone").focus();
      return;
    }
    if(cep.length <= 0) {
      cardapio.metodos.mensagem(`Informe o CEP, por favor.`);
      $("#txtCEP").focus();
      return;
    }
    if(endereco.length <= 0) {
      cardapio.metodos.mensagem(`Informe o Endereço, por favor.`);
      $("#txtEndereco").focus();
      return;
    }
    if(bairro.length <= 0) {
      cardapio.metodos.mensagem(`Informe o Bairro, por favor.`);
      $("#txtBairro").focus();
      return;
    }
    if(cidade.length <= 0) {
      cardapio.metodos.mensagem(`Informe a Cidade, por favor.`);
      $("#txtCidade").focus();
      return;
    }
    if(uf == "-1") {
      cardapio.metodos.mensagem(`Informe a UF, por favor.`);
      $("#ddlUf").focus();
      return;
    }
    if(numero.length <= 0) {
      cardapio.metodos.mensagem(`Informe a Número, por favor.`);
      $("#txtNumero").focus();
      return;
    }

    MEU_ENDERECO = {
      nome: nome,
      telefone: telefone,
      cep: cep,
      endereco: endereco,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      numero: numero,
      complemento: complemento
    }

    cardapio.metodos.carregarEtapa(3);
    cardapio.metodos.carregarResumo();

  },
//carrega a etapa resumo do pedido
  carregarResumo: () => {

    $("#listaItensResumo").html("");

    $.each(MEU_CARRINHO, (i, e) => {
      let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
      .replace(/\${nome}/g, e.name)
      .replace(/\${preco}/g, e.price.toFixed(2).replace('.' , ','))
      .replace(/\${qntd}/g, e.qntd);

      $("#listaItensResumo").append(temp);
      
    });

    $("#resumoEndereco").html(`${MEU_ENDERECO.endereco},${MEU_ENDERECO.numero},${MEU_ENDERECO.bairro} `);
    $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade},${MEU_ENDERECO.uf},${MEU_ENDERECO.cep},${MEU_ENDERECO.complemento} `);

    cardapio.metodos.finalizarPedido();

  },
  // Atualiza o link do botão do WhatsApp
  finalizarPedido: () => {
    if(MEU_CARRINHO.length > 0 && MEU_ENDERECO != null){
      var texto = 'Olá! gostaria de fazer um pedido:';
      texto += `\n*Dados do Cliente:*`;
      texto += `\n Nome: ${MEU_ENDERECO.nome}`
      texto += `\n Telefone: ${MEU_ENDERECO.telefone}`
      texto += `\n\n*Itens do pedido:*\n\n\${itens}`;
      texto += `\n*Endereço de entrega:*`;
      texto += `\n${MEU_ENDERECO.endereco},${MEU_ENDERECO.numero},${MEU_ENDERECO.bairro}`
      texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf}/${MEU_ENDERECO.cep},${MEU_ENDERECO.complemento} `
      texto += `\n\n*Total (com entrega): R$ ${VALOR_CARRINHO.toFixed(2).replace('.',',')}*`;

      var itens = '';
    }

    $.each(MEU_CARRINHO, (i,e) => {
      itens += `*${e.qntd}x* ${e.name}.......R$ ${e.price.toFixed(2).replace('.',',')} \n`;
      //último item
      if((i + 1) === MEU_CARRINHO.length){
        texto = texto.replace(/\${itens}/g,itens);

        //converter a URL
        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnEtapaResumo").attr('href', URL);
      }
    })
  },

  //carrega o link de botão reserva
  carregarBotaoReserva: () => {
    var texto = 'Olá! gostaria de fazer uma *reserva:*';

    let encode = encodeURI(texto);
    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

    $("#btnReserva").attr('href', URL);
  },

  carregarBotaoLigar: () => {
    $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);
  },
  carregarBotaoWpp: () => {
    var texto = 'Olá!';

    let encode = encodeURI(texto);
    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

    $("#btnWpp").attr('href', URL);
  },
  
  abrirDepoimento: (depoimento) => {
    $("#depoimento-1").addClass('hidden');
    $("#depoimento-2").addClass('hidden');
    $("#depoimento-3").addClass('hidden');

    $("#btnDepoimento-1").removeClass('active');
    $("#btnDepoimento-2").removeClass('active');
    $("#btnDepoimento-3").removeClass('active');

    $("#depoimento-" + depoimento).removeClass('hidden');
    $("#btnDepoimento-" + depoimento).addClass('active');
  },
// mensagem que aparece no alerta aula 23
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
      <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
        <div class="card card-item" id="\${id}">
          <div class="img-produto">
              <img src="\${img}" /> 
          </div>
          <p class="title-produto text-center mt-4">
              <b>\${nome}</b>
          </p>
          <p class="ing-produto text-center">
              <b>\${ingredientes}</b>
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
  `,
  itemCarrinho: `
    <div class="col-12 item-carrinho">
      <div class="img-produto">
        <img src="\${img}" /> 
      </div>
      <div class="dados-produto"> 
        <p class="title-produto" ><b> \${nome}</b></p>
        <p class="price-produto" ><b> R$ \${preco}</b></p>
        <p class="" ><b> <input type="checkbox" id="queijo-\${id}"> Queijo</input></b></p>
      </div>
      <div class="add-carrinho">
        <span class="btn-menos" onClick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"> <i class="fas fa-minus"> </i></span>
        <span class="add-numero-itens" id="qntd-carrinho-\${id}"> \${qntd} </span>
        <span class="btn-mais" onClick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"> <i class="fas fa-plus"> </i></span>
        <span class="btn btn-remove no-mobile" onClick="cardapio.metodos.removerItemCarrinho('\${id}')"> <i class="fas fas fa-times"> </i></span>
      </div>
    </div>
  `,

  itemResumo: `
    <div class="col-12 item-carrinho resumo">
      <div class="img-produto-resumo">
        <img src="\${img}" />
      </div>
      <div class="dados-produto">
        <p class="title-produto-resumo">
          <b><b> \${nome}</b></b>
        </p>
        <p class="price-produto-resumo">
          <b>R$ \${preco}</b>
        </p>
      </div>
      <p class="quantidade-produto-resumo">
        x <b>\${qntd}</b>
      </p>
    </div>
  `
}