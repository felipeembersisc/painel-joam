import { toast } from "react-toastify";
import instance from "./index";

import FileDownload from 'js-file-download';
import moment from "moment";

export const buscarEmpresas = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/buscar-empresas', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarEmpresasSelect = async (user) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('financeiro/buscar-empresas-select', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarEmpresa = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/salvar-empresa', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarBancos = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/buscar-bancos', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarBancosSelect = async (user) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('financeiro/buscar-bancos-select', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarBanco = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/salvar-banco', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarContasBancarias = async (user, filtro, empresaId) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/buscar-contas-bancarias', { filtro, empresaId }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarContasBancariasSelect = async (user, empresaId) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/buscar-contas-bancarias-select', { empresaId }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarContaBancaria = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/salvar-conta-bancaria', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarCategoriasMovimento = async (user, filtro, empresaId) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/buscar-categorias-movimento', { filtro, empresaId }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarCategoriasMovimentoSelect = async (user, empresaId) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('financeiro/buscar-categorias-movimento-select', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarCategoriaMovimento = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/salvar-categoria-movimento', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarMovimentoFinanceiro = async (user, filtro, empresaId) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/buscar-movimento-financeiro', { filtro, empresaId }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarMovimentoFinanceiro = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/salvar-movimento-financeiro', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const exportarMovimentoFinanceiroExcel = async (user, filtro, empresaId) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/exportar-movfinanceiro-excel', { filtro, empresaId }, { headers: { Authorization: `Bearer ${user.token}` }, responseType: 'arraybuffer' });
         const { status, data } = response;

         if (status === 200 && data) {
            FileDownload(data, `movimento_financeiro${moment().format('DDMMYYYY')}.xlsx`);
            resolve(data);
         }else{
            throw Error(data.message);
         }
      } catch (err) {
         toast.error(err.message);
      }
   });
};

export const exportarMovimentoFinanceiroPdf = async (user, filtro, empresaId) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('financeiro/exportar-movfinanceiro-pdf', { filtro, empresaId }, { headers: { Authorization: `Bearer ${user.token}` }, responseType: 'arraybuffer' });
         const { status, data } = response;

         if (status === 200 && data) {
            FileDownload(data, `movimento_financeiro${moment().format('DDMMYYYY')}.pdf`);
            resolve(data);
         }else{
            throw Error(data.message);
         }
      } catch (err) {
         toast.error(err.message);
      }
   });
};