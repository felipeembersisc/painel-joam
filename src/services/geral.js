import instance from "./index";

export async function getEstados(user) {
   return new Promise(async (resolve, reject) => {
      try {
         const url = "geral/buscar-estados";
         const response = await instance.get(url, {
            headers: { Authorization: `Bearer ${user.token}` },
         });
         const { status, data } = response;
         if (status === 200) {
            resolve(data);
         } else {
            reject(data);
         }
      } catch (err) {
         reject(err);
      }
   });
}

export async function getCidades(user, estado_id) {
   return new Promise(async (resolve, reject) => {
      try {
         const url = "geral/buscar-cidades";
         const response = await instance.post(
            url,
            { estado_id },
            { headers: { Authorization: `Bearer ${user.token}` } }
         );
         const { status, data } = response;
         if (status === 200) {
            resolve(data);
         } else {
            reject(data);
         }
      } catch (err) {
         reject(err);
      }
   });
}

export async function getCeps(cep) {
   try {
      const response = await instance.get(
         `https://viacep.com.br/ws/${cep}/json/`
      );
      const data = response.data;

      if (data.erro) {
         return {
            codigo: 18,
            erro: "CEP não encontrado.",
         };
      } else if (data.cep) {
         return {
            cep: data.cep,
            logradouro: data.logradouro,
            complemento: data.complemento,
            bairro: data.bairro,
            localidade: data.localidade,
            uf: data.uf,
            id: data.ibge,
         };
      } else {
         return {
            codigo: 19,
            erro: "Falha ao buscar CEP, tente novamente.",
         };
      }
   } catch (err) {
      return {
         codigo: 19,
         erro: "Falha ao buscar CEP, tente novamente.",
      };
   }
}

export async function getDiasUteis(idFuncionario, datas) {
   try {
      const sessao = await JSON.parse(
         localStorage.getItem("@PoupaSistema:user")
      );
      const url = "geral/dias-uteis";
      const response = await instance.post(
         url,
         { datas, idFuncionario },
         { headers: { token: sessao.token } }
      );
      const { status, data } = response;
      if (status === 200) {
         return data;
      } else {
         throw Error();
      }
   } catch (err) {
      return err;
   }
}

export async function getUrlArquivo(caminhoArquivo) {
   try {
      const sessao = await JSON.parse(
         localStorage.getItem("@PoupaSistema:user")
      );
      const url = "geral/buscar-url-arquivo";
      const response = await instance.post(
         url,
         { caminhoArquivo },
         { headers: { token: sessao.token } }
      );
      const { status, data } = response;
      if (status === 200) {
         return data;
      } else {
         throw Error();
      }
   } catch (err) {
      return err;
   }
}
