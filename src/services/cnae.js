import instance from "./index";

export const listar = async (token, codigo, segmento, nome, numero, pagina) => {
  return new Promise(async (resolve, reject) => {
    try {
      segmento = segmento && segmento.value ? segmento.value : segmento ? segmento : null;

      const response = await instance.post(
        "cnae/painel/listar",
        {
          codigo_cna: codigo && codigo != '' ? codigo : null,
          codigo_sgc: segmento,
          nome_cna: nome && nome != '' ? nome : null,
          numero_cna: numero && numero != '' ? numero : null,
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

export const listarSegmentos = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resultado = await instance.get(
        `segmento_cnae/`,
        { headers: { token: token } }
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
}

export const salvar = async (token, dados) => {
  return new Promise(async (resolve, reject) => {
    try {
      dados.codigo_sgc = dados.codigo_sgc && dados.codigo_sgc.value ? dados.codigo_sgc.value : dados.codigo_sgc ? dados.codigo_sgc : null;

      const response = await instance.post(
        "cnae/gravar",
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
        `cnae/inativar?codigo=${id}`,
        { headers: { token: token } }
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