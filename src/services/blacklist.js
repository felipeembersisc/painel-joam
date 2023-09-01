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

export async function salvar(dados) {
   return new Promise(async (resolve, reject) => {
      try {
         const { cnpj_blc } = dados

         const sessao = JSON.parse(localStorage.getItem("@CRMAdmin:user"))
         const resultado = await instance.post("/blacklist/salvar", { cnpj_blc }, { headers: { token: sessao.token } })

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

export async function bloquear(dados) {
   return new Promise(async (resolve, reject) => {
      try {
         const { cnpj_blc } = dados

         const sessao = JSON.parse(localStorage.getItem("@CRMAdmin:user"))
         const resultado = await instance.post("/blacklist/bloquear", { cnpj_blc }, { headers: { token: sessao.token } })

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