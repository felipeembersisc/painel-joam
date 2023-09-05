import instance from "./index";

export const listar = async (token) => {
   return new Promise(async (resolve, reject) => {
      try {
         const url = "mailing_configuracao/listar";
         const response = await instance.get(
            url,
            { headers: { token } }
         );
         const { status, data } = response;
         if (status === 200) {
            resolve(data.result[0].configuracoes);
         } else {
            reject(data);
         }
      } catch (err) {
         reject(err);
      }
   });
};

export const listarSistemas = async (token) => {
   return new Promise(async (resolve, reject) => {
      try {
         const url = "mailing_configuracao/listar-sistemas";
         const response = await instance.get(
            url,
            { headers: { token } }
         );
         const { status, data } = response;
         if (status === 200) {
            resolve(data.result[0].sistemas);
         } else {
            reject(data);
         }
      } catch (err) {
         reject(err);
      }
   });
};

export const salvarConfiguracao = async (token, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         let { codigo_sis, codigo_mcf } = dados;
         codigo_sis = codigo_sis?.value ?? codigo_sis;
         codigo_mcf = codigo_mcf || null;

         const url = "mailing_configuracao/gravar";
         const response = await instance.post(
            url,
            { ...dados, codigo_sis, codigo_mcf },
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

export const removerConfiguracao = async (token, id) => {
   return new Promise(async (resolve, reject) => {
      try {
         const url = `mailing_configuracao/inativar?codigo=${id}`;
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