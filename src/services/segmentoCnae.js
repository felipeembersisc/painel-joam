import instance from "./index";

export const listar = async (token, divisaoInicial, divisaoFinal, nome, pagina) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await instance.post(
        "segmento_cnae/",
        {
          divisaoinicial_sgc: divisaoInicial,
          divisaofinal_sgc: divisaoFinal,
          nome_sgc: nome,
          pagina: pagina
        },
        { headers: { token } }
      );

      if (response.status === 200) {
        const data = response.data.dados;
        resolve(data);
      } else {
        reject(response.data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const salvar = async (token, dados) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await instance.post(
        "segmento_cnae/gravar",
        { ...dados },
        { headers: { token } }
      );

      const { status, data } = response;

      if (status === 200) {
        resolve(data);
      } else {
        reject(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const inativar = async (token, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resultado = await instance.get(
        `segmento_cnae/inativar?codigo=${id}`,
        { headers: { token } }
      );

      const { status, data } = resultado;

      if (status === 200) {
        resolve(data);
      } else {
        reject(data);
      }
    } catch (error) {
      reject(error);
    }
  });
};