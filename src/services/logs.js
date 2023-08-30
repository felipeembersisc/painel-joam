import { toast } from "react-toastify";
import instance from "./index";

export const buscarLogsErro = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('logs/buscar-erros', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
         const { status, data } = response;

         if (status === 200 && data) {
            resolve(data);
         }else{
            throw Error(data.message);
         }
      } catch (err) {
         toast.error(err.message);
      }
   });
};

export const buscarLogsAlteracoes = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('logs/buscar-alteracoes', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
         const { status, data } = response;

         if (status === 200 && data) {
            resolve(data);
         }else{
            throw Error(data.message);
         }
      } catch (err) {
         toast.error(err.message);
      }
   });
};