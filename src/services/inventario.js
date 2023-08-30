import { toast } from "react-toastify";
import instance from "./index";

import FileDownload from 'js-file-download';
import moment from "moment";

export const buscarAtivos = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/buscar-ativos', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarAtivosAssinados = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/buscar-ativos-assinados', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarAtivosInventario = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/buscar-ativos-inventario', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
         const { status, data } = response;

         if (status === 200 && data) {
            resolve(data);
         }else{
            throw Error(data.message);
         }
      } catch (err) {
         return toast.error(err.message);
      }
   });
};

export const exportarAtivosExcel = async (user, filtro) => {
   try {
      const response = await instance.post('inventario/exportar-ativos-excel', { filtro }, { headers: { Authorization: `Bearer ${user.token}` }, responseType: 'arraybuffer' });
      const { status, data } = response;

      if (status === 200 && data) {
         FileDownload(data, `ativos_${moment().format('DDMMYYYY')}.xlsx`);
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      return toast.error(err.message);
   }
};

export const buscarAtivosEscritorio = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/buscar-ativos-escritorio', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarAtivosEntradaDocumento = async (user) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('inventario/buscar-ativos-entrada-documento', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarTransferenciasAtivos = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/buscar-transferencias-ativos', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarAtributosAtivo = async (user) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('inventario/atibutos-ativo', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarAtivo = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/salvar-ativo', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const validarAtivo = async (user, ati_tipo_id, ati_modelo_id, ati_fabricante_id) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/validar-ativo', { ati_tipo_id, ati_modelo_id, ati_fabricante_id }, { headers: { Authorization: `Bearer ${user.token}` } });
         const { status, data } = response;

         if (status === 200 && data) {
            resolve(data.isAtivo);
         }else{
            throw Error(data.message);
         }
      } catch (err) {
         toast.error(err.message);
      }
   });
};

export const buscarFuncionarios = async (user) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('inventario/buscar-funcionarios', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarEscritorios = async (user) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('inventario/buscar-escritorios', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarEscritoriosSelect = async (user) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('inventario/buscar-escritorios-select', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarFornecedoresSelect = async (user) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('inventario/buscar-fornecedores-select', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarFornecedores = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/buscar-fornecedores', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarFornecedor = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/salvar-fornecedor', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarCentrosCustoSelect = async (user) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.get('inventario/buscar-centroscusto-select', { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarCentrosCusto = async (user, filtro) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/buscar-centroscusto', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarCentroCusto = async (user, dados) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/salvar-centrocusto', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const salvarTransferenciaAtivo = async (user, dados) => {
   try {
      const response = await instance.post('inventario/salvar-transferencia-ativo', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data.result) {
         return toast.success(data.message);
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const salvarEmprestimo = async (user, dados) => {
   try {
      const response = await instance.post('inventario/salvar-emprestimo', { dados }, { headers: { Authorization: `Bearer ${user.token}` }, responseType: 'arraybuffer' });
      const { status, data } = response;

      if (status === 200 && data) {
         FileDownload(data, 'termo_emprestimo.pdf');
         toast.success('Emprestimo feito com sucesso 😁. ( Pendencia de Assinatura )');
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const editarArquivoDocumento = async (user, documento, arquivo) => {
   try {
      const response = await instance.post('inventario/editar-arquivo-documento', { documento, arquivo }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         toast.success(data.message);
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const buscarUrlTermo = async (user, nomeTermo) => {
   try {
      const response = await instance.post('inventario/buscar-url-termo', { nomeTermo }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         window.open(data, '_blank');
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const buscarTransferenciasAtivo = async (user, idAtivo) => {
   try {
      const response = await instance.post('inventario/buscar-transferencias-ativo', { idAtivo }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const buscarHistoricoQuantidadeAtivo = async (user, idAtivo) => {
   try {
      const response = await instance.post('inventario/buscar-historico-quantidade-ativo', { idAtivo }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const buscarChecklistInventario = async (user, filtro) => {
   try {
      const response = await instance.post('inventario/buscar-checklist', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const salvarChecklistInventario = async (user, dados) => {
   try {
      const response = await instance.post('inventario/salvar-checklist', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         toast.success('Observação salva com sucesso. Entraremos em contato 😁');
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const verificarObservacaoChecklist = async (user, type, idChecklist) => {
   try {
      const response = await instance.post('inventario/verificar-observacao-checklist', { type, idChecklist }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         toast.success(`Observação ${type == 'aprovar' ? 'aprovada' : 'rejeitada'} com sucesso 😁`);
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const buscarDocumentosEntrada = async (user, filtro) => {
   try {
      const response = await instance.post('inventario/buscar-documentos-entrada', { filtro }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const buscarDetalhesDocumento = async (user, documentoId) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/buscar-detalhes-documento', { documentoId }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarUrlDocumento = async (user, nomeDocumento) => {
   try {
      const response = await instance.post('inventario/buscar-url-documento', { nomeDocumento }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         window.open(data, '_blank');
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const validarPatrimonio = async (user, patrimonio) => {
   try {
      const response = await instance.post('inventario/validar-patrimonio', { patrimonio }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const salvarEntradaDocumento = async (user, dados) => {
   try {
      const response = await instance.post('inventario/salvar-entrada-documento', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         toast.success(data.message);
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const salvarAtivosEscritorio = async (user, dados) => {
   try {
      const response = await instance.post('inventario/salvar-ativos-escritorio', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         toast.success(data.message);
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const validarNumeroNota = async (user, numeroNota, serieNota, idFornecedor) => {
   try {
      const response = await instance.post('inventario/validar-numero-nota', { numeroNota, serieNota, idFornecedor }, { headers: { Authorization: `Bearer ${user.token}` }});
      const { status, data } = response;

      if (status === 200 && data) {
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const salvarCheckTermo = async (user, itens, isTermoSupervisor, escritorioId, funcionarioId) => {
   return new Promise(async (resolve, reject) => {
      try {
         const response = await instance.post('inventario/salvar-check-termo', { itens, isTermoSupervisor, escritorioId, funcionarioId }, { headers: { Authorization: `Bearer ${user.token}` } });
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

export const buscarQuantidadeAtivo = async (user, idAtivo) => {
   try {
      const response = await instance.post('inventario/buscar-quantidade-ativo', { idAtivo }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;

      if (status === 200 && data) {
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};

export const salvarQuantidadeAtivo = async (user, dados) => {
   try {
      const response = await instance.post('inventario/salvar-quantidade-ativo', { dados }, { headers: { Authorization: `Bearer ${user.token}` } });
      const { status, data } = response;
      if (status === 200 && data) {
         toast.success(data.message);
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
};