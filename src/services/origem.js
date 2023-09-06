import instance from "./index";

export const listar = async (token, nome, pagina) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await instance.post(
        "origem-prospect/",
        {
          nome: nome,
          pagina: pagina,
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
        "origem-prospect/gravar",
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
        `origem-prospect/inativar?codigo=${id}`,
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
