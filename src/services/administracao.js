import { toast } from "react-toastify";
import instance from "./index";

export const buscarUsuarios = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('administracao/buscar-usuarios', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarUsuario = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('administracao/salvar-usuario', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
         const { status, data } = response;

         if (status === 200 && data) {
            resolve(data.result);
            toast.success(data.message);
         }else{
            throw Error(data.message);
         }
      } catch (err) {
         toast.error(err.message);
      }
   });
};

export const salvarSenhaPainel = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('administracao/salvarsenha-painel', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
         const { status, data } = response;

         if (status === 200 && data) {
            resolve(data.result);
            toast.success(data.message);
         }else{
            throw Error(data.message);
         }
      } catch (err) {
         toast.error(err.message);
      }
   });
};

export const buscarGruposUsuariosSelect = async (user) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('administracao/buscar-gruposusuarios-select', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarGruposUsuarios = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('administracao/buscar-gruposusuarios', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarGrupoUsuario = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('administracao/salvar-grupousuario', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
         const { status, data } = response;

         if (status === 200 && data) {
            resolve(data.result);
            toast.success(data.message);
         }else{
            throw Error(data.message);
         }
      } catch (err) {
         toast.error(err.message);
      }
   });
};