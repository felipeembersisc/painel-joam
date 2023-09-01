export default {
   somenteNumeros: function (str) {
      return str.replace(/[^0-9]+/g, "");
   },
   mascaraTelefone: function (str) {
      str = str.replace(/\D/g, ""); //Remostre tudo o que não é dígito
      str = str.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
      str = str.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
      return str;
   },
   mascaraCpfCnpj: function (str) {
      //Remove tudo o que não é dígito
      str = str.replace(/\D/g, "");

      if (str.length <= 11) {
         //CPF

         //Coloca um ponto entre o terceiro e o quarto dígitos
         str = str.replace(/(\d{3})(\d)/, "$1.$2");

         //Coloca um ponto entre o terceiro e o quarto dígitos
         //de novo (para o segundo bloco de números)
         str = str.replace(/(\d{3})(\d)/, "$1.$2");

         //Coloca um hífen entre o terceiro e o quarto dígitos
         str = str.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      } else {
         //CNPJ

         //Coloca ponto entre o segundo e o terceiro dígitos
         str = str.replace(/^(\d{2})(\d)/, "$1.$2");

         //Coloca ponto entre o quinto e o sexto dígitos
         str = str.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");

         //Coloca uma barra entre o oitastro e o nono dígitos
         str = str.replace(/\.(\d{3})(\d)/, ".$1/$2");

         //Coloca um hífen depois do bloco de quatro dígitos
         str = str.replace(/(\d{4})(\d)/, "$1-$2");
      }
      return str;
   },
   limitarTexto: function (texto, length) {
      return texto.substr(0, length) + "...";
   },
   formatarMoeda: function (valor) {
      valor = valor.toFixed(2) + "";
      valor = parseInt(valor.replace(/[\D]+/g, ""));
      valor = valor + "";
      valor = valor.replace(/([0-9]{2})$/g, ",$1");

      if (valor.length > 6) {
         valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
      }

      return valor;
   },
   formataMoeda: function (valor = 0) {
      valor = valor.toString();
      if (valor.indexOf(".") < 0) {
         valor = valor + ".00";
      }
      let v = valor.replace(/\D/g, "");
      v = (v / 100).toFixed(2) + "";
      v = v.replace(".", ",");
      v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
      v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
      valor = v;

      return valor;
   },
   formatarMoedaMilhar: function (v) {
      let negativo = "";
      if (v) {
         negativo = v.indexOf("-") >= 0 ? "-" : "";
         v = v.replace(/\D/g, "");
         v = (v / 100).toFixed(2) + "";
         v = v.replace(".", ",");
         v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
         v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
      }

      return negativo === "-" ? negativo + v : v;
   },
   formatarMoedaBanco: function (valor) {
      valor = valor.replace(".", "");
      valor = valor.replace(",", ".");

      return valor;
   },
   formatarCEP: function (str) {
      var re = /^([\d]{2})\.*([\d]{3})-*([\d]{3})/;

      if (re.test(str)) {
         return str.replace(re, "$1$2-$3");
      }

      return str;
   },
   validarCpf: function (cpf) {
      let Soma;
      let Resto;
      Soma = 0;
      cpf = this.somenteNumeros(cpf);
      if (cpf === "00000000000") return false;

      for (let i = 1; i <= 9; i++)
         Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;

      if (Resto === 10 || Resto === 11) Resto = 0;
      if (Resto !== parseInt(cpf.substring(9, 10))) return false;

      Soma = 0;
      for (let i = 1; i <= 10; i++)
         Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
      Resto = (Soma * 10) % 11;

      if (Resto === 10 || Resto === 11) Resto = 0;
      if (Resto !== parseInt(cpf.substring(10, 11))) return false;
      return true;
   },
   camelCase: function (valor) {
      var loweredText = valor.toLowerCase();
      var words = loweredText.split(" ");
      for (var a = 0; a < words.length; a++) {
         var w = words[a];

         if (w) {
            var firstLetter = w[0];
            w = firstLetter.toUpperCase() + w.slice(1);
            words[a] = w;
         }
      }
      return words.join(" ");
   },
   iniciais: function (nome) {
      let inicialUm = null, inicialDois = null;

      if (nome) {
         nome = nome.split(" ");
         inicialUm = nome[0].charAt(0).toUpperCase();
         inicialDois = nome[nome.length - 1].charAt(0).toUpperCase();
         nome = inicialUm + inicialDois;
      }

      return nome;
   },
   formatarStringfy: function (arr) {
      let retorno = null;

      if (arr) {
         retorno = JSON.stringify(arr);
         retorno = retorno.replace('[', '{');
         retorno = retorno.replace(']', '}');
      }

      return retorno;
   },
   retornoStatusMailing: function (status) {
      let retorno = null;

      switch (status) {
         case 1: retorno = "danger"; break;
         case 2: retorno = "info"; break;
         case 3: retorno = "warning"; break;
         case 4: retorno = "danger"; break;
         case 5: retorno = "success"; break;
         default: retorno = "warning"; break;
      }

      return retorno;
   },
   validarSenha: function (senha, senhaConfirmacao) {
      let mensagem = "";

      // Valida se as senhas estão diferentes
      if (senha != senhaConfirmacao) {
         mensagem = "As senhas diferem entre si, por favor, verificar.";
      }

      // Verifica se a senha tem menos de 9 caracteres
      if (senha.length < 9) {
         mensagem = "A senha precisa ter no mínimo 9 caracteres.";
      }

      // Verifica se a senha não contém um número
      const regexNumero = /[0-9]/;
      if (!regexNumero.test(senha)) {
         mensagem = "A senha precisa ter no mínimo 1 número (0-9).";
      }

      // Verifica se a senha não contém 1 letra maiúscula
      const regexLetraMaiuscula = /[A-Z]/;
      if (!regexLetraMaiuscula.test(senha)) {
         mensagem = "A senha precisa ter no mínimo 1 uma letra maiúscula.";
      }

      // Verifica se a senha não contém 1 letra minúscula
      const regexLetraMinuscula = /[a-z]/;
      if (!regexLetraMinuscula.test(senha)) {
         mensagem = "A senha precisa ter no mínimo 1 uma letra minúscula.";
      }

      // Verifica se a senha contém uma sequência de caracteres repetidos em sequência
      const regexCaracteresRepetidos = /([0-9]{2,3})\1/g;
      if (regexCaracteresRepetidos.test(senha)) {
         mensagem = "A senha não pode contém caracteres repetidos em sequência";
      }

      return mensagem;
   },
   verificarDiaSemana: function () {
      try {
         const semana = [
            "Domingo",
            "Segunda-Feira",
            "Terça-Feira",
            "Quarta-Feira",
            "Quinta-Feira",
            "Sexta-Feira",
            "Sábado",
         ];

         const data = new Date();

         return semana[data.getDay()];
      } catch (error) {
         console.log(error);
      }
   }
};
