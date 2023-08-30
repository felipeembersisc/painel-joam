import { toast } from "react-toastify";

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
   isCpf: function (cpf) {
      let Soma;
      let Resto;
      Soma = 0;
      if (cpf == "00000000000") return false;

      for (let i = 1; i <= 9; i++)
         Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;

      if (Resto == 10 || Resto == 11) Resto = 0;
      if (Resto != parseInt(cpf.substring(9, 10))) return false;

      Soma = 0;
      for (let i = 1; i <= 10; i++)
         Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
      Resto = (Soma * 10) % 11;

      if (Resto == 10 || Resto == 11) Resto = 0;
      if (Resto != parseInt(cpf.substring(10, 11))) return false;
      return true;
   },
   limparCamposNulls: function (data) {
      const chaves = Object.keys(data);

      for (let key of chaves) {
         if (
            data[key] == null ||
            data[key] == undefined ||
            JSON.stringify(data[key]) == "[{}]" ||
            JSON.stringify(data[key]) == "{}"
         ) {
            delete data[key];
         }

         if (typeof data[key] == "object" && data[key].length > 0) {
            data[key].map((item) => {
               const chaves = Object.keys(item);

               chaves.map((chave) => {
                  if (item[chave] == null || item[chave] == undefined) {
                     delete item[chave];
                  }
               });
            });
         }

         if (typeof data[key] == "object" && !data[key].length) {
            const chaves = Object.keys(data[key]);

            chaves.map((chave) => {
               if (data[key][chave] == null || data[key][chave] == undefined) {
                  delete data[key][chave];
               }
            });
         }
      }

      return data;
   },
   toBase64: file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
   }),
   validarArquivo: async function(file, types, size){
      if(file.length > 0){
         if(!types.includes(file[0].type)){
            return toast.info('Tipo de arquivo incorreto 😅');
         }

         if(!file[0].size > size*(1024**2)){
            return toast.info(`Tamanho máximo de arquivo: ${size}Mb 😅`);
         }

         let base64 = await this.toBase64(file[0]);

         if(base64){
            return { base64, file: { name: file[0].name, type: file[0].type } };
         }
      }else{
         toast.info('Selecione um arquivo 😅');
      }
   },
   formatarMoeda: function (valor) {
      // valor = Number(valor).toFixed(2);
      // valor = valor.replace(/[\D]+/g, "");
      // valor = valor + "";
      // valor = valor.replace(/([0-9]{2})$/g, ",$1");

      // if (valor.length > 6) {
      //    valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
      // }

      // return valor;
      
      valor = String(valor);
      const [integerPart, decimalPart = ''] = valor.split('.');

      // Formata a parte inteira com separadores de milhares
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      // Retorna a string de moeda formatada
      return `${formattedInteger},${decimalPart.padEnd(2, '0')}`;
   },
   formatarMoedaMilhar: function (valor) {
      // let negativo = "";
      // if (v) {
      //    v = String(v);
      //    negativo = v.indexOf("-") >= 0 ? "-" : "";
      //    v = v.replace(/\D/g, "");
      //    v = (Number(v) / 100).toFixed(2) + "";
      //    v = v.replace(".", ",");
      //    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
      //    v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
      // }

      // return negativo === "-" ? negativo + v : v;
      // Divide a parte inteira da parte decimal (se existir)
      valor = String(valor);
      const [integerPart, decimalPart = ''] = valor.split('.');

      // Formata a parte inteira com separadores de milhares
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      // Retorna a string de moeda formatada
      return `${formattedInteger},${decimalPart.padEnd(2, '0')}`;
   },
   formatarMoedaBanco: function (valor) {
      // valor = valor.replace(".", "");
      // valor = valor.replace(",", ".");

      // return valor;

      valor = String(valor);
      valor = valor.replaceAll('.','');
      valor = valor.replaceAll(',','.');

      return Number(valor);
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
      let inicialUm = null,
         inicialDois = null;

      if (nome) {
         let auxNome = nome.split(" ");
         inicialUm = auxNome[0].charAt(0).toUpperCase();
         inicialDois = auxNome[auxNome.length - 1].charAt(0).toUpperCase();
         nome = inicialUm + inicialDois;
      }

      return nome;
   },
   formatarStringfy: function (arr) {
      let retorno = null;

      if (arr) {
         retorno = JSON.stringify(arr);
         retorno = retorno.replace("[", "{");
         retorno = retorno.replace("]", "}");
      }

      return retorno;
   }
};
