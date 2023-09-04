import instance from "./index"

export async function listar(token) {
   return new Promise(async (resolve, reject) => {
      try {
         const resultado = await instance.get("/blacklist/listar", { headers: { token } })

         const { status, data } = resultado;

         if (status === 200) {
            resolve(data)
         } else {
            reject(data)
         }
      } catch (error) {
         console.log(error)
         reject(error)
      }
   })
}

export async function salvar(token, dados) {
   return new Promise(async (resolve, reject) => {
      try {
         const { cnpj_blc } = dados
         const resultado = await instance.post("/blacklist/salvar", { cnpj_blc }, { headers: { token } })

         const { status, data } = resultado

         if (status === 200) {
            resolve(data)
         } else {
            reject(data)
         }
      } catch (error) {
         reject(error)
      }
   })
}

export async function bloquear(token, dados) {
   return new Promise(async (resolve, reject) => {
      try {
         const { cnpj_blc } = dados
         const resultado = await instance.post("/blacklist/bloquear", { cnpj_blc }, { headers: { token } })

         const { status, data } = resultado

         if (status === 200) {
            resolve(data)
         } else {
            reject(data)
         }
      } catch (error) {
         reject(error)
      }
   })
}