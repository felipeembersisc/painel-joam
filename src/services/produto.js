import instance from "./index";

export const listarProdutos = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = "produto/buscar";
      const response = await instance.get(
        url,
        { headers: { token } }
      );
      const { status, data } = response;
      if (status === 200) {
        resolve(data[0].produtos);
      } else {
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};