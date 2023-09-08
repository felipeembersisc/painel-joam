import instance from "./index";

export const listar = async (token, codigo_pro, titulo_men, texto_men) => {
   return new Promise(async (resolve, reject) => {
      try {
         const url = "mensagem/";
         const response = await instance.post(
            url,
            { codigo_pro, titulo_men, texto_men },
            { headers: { token } }
         );
         const { status, data } = response;
         if (status === 200) {
            resolve(data.dados);
         } else {
            reject(data);
         }
      } catch (err) {
         reject(err);
      }
   });
};

export const salvar = async (token, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const { codigo_pro } = dados;
         const url = "mensagem/gravar";

         dados = { ...dados, codigo_pro: codigo_pro?.value ?? codigo_pro };
         const response = await instance.post(
            url,
            { ...dados },
            { headers: { token } }
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
};

export const inativar = async (token, id) => {
   return new Promise(async (resolve, reject) => {
      try {
         const url = `mensagem/inativar?codigo=${id}`;
         const response = await instance.get(
            url,
            { headers: { token } }
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
};