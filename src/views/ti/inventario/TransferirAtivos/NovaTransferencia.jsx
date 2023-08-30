import { useState, useEffect } from 'react';

import { Grid, Stack, Button, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import SubCard from '@/ui-component/cards/SubCard';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

// Services
import { buscarAtivos, buscarAtivosInventario, buscarUrlDocumento, salvarTransferenciaAtivo } from '../../../../services/inventario';

// Forms
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';

// Components
import { toast } from 'react-toastify';
import { SimpleModal } from '../../../../components/Modal';
import { SelectForm } from '../../../../components/SelectForm';
import AddItensTransferencia from './AddItensTransferencia';

const schema = yup.object({
   // doc_escritorio_origem_id: yup.string().required('Campo obrigatório'),
   doc_escritorio_origem_id: yup.number().nullable().required('Campo obrigatório').transform((value) => isNaN(value) ? null : value),
   doc_centro_custo_origem_id: yup.number().nullable().required('Campo obrigatório').transform((value) => isNaN(value) ? null : value),
   doc_funcionario_origem_id: yup.number().nullable().transform((value) => isNaN(value) ? null : value),
   doc_escritorio_destino_id: yup.number().nullable().required('Campo obrigatório').transform((value) => isNaN(value) ? null : value),
   doc_centro_custo_destino_id: yup.number().nullable().required('Campo obrigatório').transform((value) => isNaN(value) ? null : value),
   doc_funcionario_destino_id: yup.number().nullable().transform((value) => isNaN(value) ? null : value),
   itens_transferencia: yup.array(yup.object()),
});

const defaultValues = {
   doc_escritorio_origem_id: null,
   doc_centro_custo_origem_id: null,
   doc_funcionario_origem_id: null,
   doc_escritorio_destino_id: null,
   doc_centro_custo_destino_id: null,
   doc_funcionario_destino_id: null,
   itens_transferencia: []
};

// ==============================|| TRANSFERIR ATIVOS ||============================== //

const NovaTransferencia = ({ open, setOpen, funcionarios, escritorios, getTransferenciasAtivos, centrosCusto }) => {

   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { control, setValue, watch, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
   const { fields, remove } = useFieldArray({ control, name: "itens_transferencia", shouldUnregister: true });

   const itensTransferencia = watch('itens_transferencia') ?? null;
   // const urlDocumento = watch('doc_url') ?? null;

   // Validações
   const escritorioOrigem = watch('doc_escritorio_origem_id');
   const escritorioDestino = watch('doc_escritorio_destino_id');
   const centroCustoOrigem = watch('doc_centro_custo_origem_id');
   const funcionarioOrigem = watch('doc_funcionario_origem_id');
   const disabledEscritorioDestino = (escritorioOrigem && escritorioDestino && funcionarioOrigem && escritorioOrigem === escritorioDestino) ? true : false;

   const [disabledFuncionarioDestino, setDisabledFuncionarioDestino] = useState(true);

   // Filtros
   const [funcionariosOrigemFiltrados, setFuncionariosOrigemFiltrados] = useState([]);
   const [funcionariosDestinoFiltrados, setFuncionariosDestinoFiltrados] = useState([]);

   // Modal
   const [openAddItens, setOpenAddItens] = useState(false);
   
   const [inventario, setInventario] = useState([]);

   function handleAddItens(data){
      if(itensTransferencia.find(item => item.ine_id === data.ine_id)){
         if(itensTransferencia.length == 1){
            setValue('doc_centro_custo_origem_id', null);
         }

         let auxItens = itensTransferencia.filter(item => item.ine_id !== data.ine_id);
         setValue('itens_transferencia', auxItens);
      }else{
         let auxItens = [...itensTransferencia, data];

         setValue('itens_transferencia', auxItens);
         setValue('doc_centro_custo_origem_id', data.ine_centro_custo_id);
      }
   }

   const handleSave = async (data) => {
      try {
         if((data.doc_escritorio_origem_id === data.doc_escritorio_destino_id) && (data.doc_centro_custo_origem_id === data.doc_centro_custo_destino_id) && (!data.doc_funcionario_origem_id && !data.doc_funcionario_destino_id)){
            return toast.info('Mesmo centro de custo selecionado 😅');
         }

         if(data.doc_funcionario_origem_id && data.doc_funcionario_destino_id && data.doc_funcionario_origem_id === data.doc_funcionario_destino_id){
            return toast.info('Mesmo funcionario selecionado 😅');
         }

         handleLoad(true);

         if(data.itens_transferencia.length <= 0){
            return toast.info('Selecione ao menos 1 item 😅');
         }
         
         let dadosOrigem = {
            type: data.doc_funcionario_origem_id ? 'funcionario' : 'escritorio'
         };

         let dadosDestino = {
            type: data.doc_funcionario_destino_id ? 'funcionario' : 'escritorio'
         };

         escritorios.map((esc) => {
            if (data.doc_escritorio_origem_id == esc.id) {
               dadosOrigem = { 
                  ...dadosOrigem, 
                  escritorio: esc,
                  responsavel: esc.responsavel,
               }
            }

            if (data.doc_escritorio_destino_id == esc.id) {
               dadosDestino = { 
                  ...dadosDestino, 
                  escritorio: esc,
                  responsavel: esc.responsavel
               }
            }
         });
         
         funcionarios.map((fun) => {
            if(data.doc_funcionario_origem_id && data.doc_funcionario_origem_id == fun.id){
               dadosOrigem = { 
                  ...dadosOrigem, 
                  responsavel: {
                     fun_nome: fun.label,
                     fun_id: fun.id
                  } 
               }
            }
   
            if(data.doc_funcionario_destino_id && data.doc_funcionario_destino_id == fun.id){
               dadosDestino = {
                  ...dadosDestino,
                  responsavel: {
                     fun_nome: fun.label,
                     fun_id: fun.id
                  } 
               }
            }
         });

         centrosCusto.map(cen => {
            if(data.doc_centro_custo_origem_id === cen.id){
               dadosOrigem = { 
                  ...dadosOrigem, 
                  centroCusto: {
                     id: cen.id,
                     nome: cen.label
                  }
               }
            }

            if(data.doc_centro_custo_destino_id === cen.id){
               dadosDestino = { 
                  ...dadosDestino,
                  centroCusto: {
                     id: cen.id,
                     nome: cen.label
                  }
               }
            }
         })

         let auxItens = data.itens_transferencia;
         await salvarTransferenciaAtivo(user, { itens: auxItens, origem: dadosOrigem, destino: dadosDestino });
      } catch (error) {
      }finally{
         await getTransferenciasAtivos(user);
         setOpen(!open);
         handleLoad(false);
      }
   };

   const handleGetItens = async() => {
      if(!escritorioOrigem){
         return toast.info("Selecione alguma origem 😅");
      }

      let auxFiltro = {
         escritorio_id: escritorioOrigem ?? null,
         funcionario_id: funcionarioOrigem ?? null  
      }
      
      try {
         handleLoad(true);
         const result = await buscarAtivosInventario(user, auxFiltro);

         if(result.length > 0){
            if(escritorioOrigem && !funcionarioOrigem){
               if(result.filter(res => res.ine_in_escritorio).length > 0){
                  setOpenAddItens(!openAddItens);
                  return setInventario(result.filter(res => res.ine_in_escritorio));
               }else{
                  return toast.info('Nenhum ativo encontrado 😅');
               }
            }else{
               setInventario(result);
               setOpenAddItens(!openAddItens);
            }
         }else{
            toast.info('Nenhum ativo encontrado 😅');
         }
      } catch (error) {
      }finally {
         handleLoad(false);
      }
   }

   function handleChangeEscritorio(type, esc){
      switch(type){
         case 'origem':
            setValue('doc_escritorio_origem_id', esc);
            setValue('itens_transferencia', []);
            setValue('doc_funcionario_origem_id', null);
            setValue('doc_centro_custo_origem_id', null);

            if(esc){
               const auxFiltro = funcionarios.filter(fun => fun.fun_escritorio_id.includes(esc));
               setFuncionariosOrigemFiltrados(auxFiltro);
            }else{
               setFuncionariosOrigemFiltrados([]);
            }
         break;
         case 'destino':
            setValue('doc_escritorio_destino_id', esc);
            if(esc){
               const auxFiltro = funcionarios.filter(fun => fun.fun_escritorio_id.includes(esc));
               setFuncionariosDestinoFiltrados(auxFiltro);

               if(esc == escritorioOrigem){
                  setDisabledFuncionarioDestino(false);
               }
            }else{
               setFuncionariosDestinoFiltrados([]);
               setDisabledFuncionarioDestino(true);
            }
         break;
      }
   }

   function handleChangeFuncionario(type, fun){
      switch(type){
         case 'origem':
            setValue('doc_funcionario_origem_id', fun);
            setValue('itens_transferencia', []);

            if(fun){
               handleChangeEscritorio('destino', escritorioOrigem);
            }else{
               handleChangeEscritorio('destino', null);
            }
         break;
         case 'destino':
            setValue('doc_funcionario_destino_id', fun);
         break;
      }
   }

   function removerItems(length, index){
      if(length == 1){
         setValue('doc_centro_custo_origem_id', null);
         remove(index);
      }else{
         remove(index);
      }
   }

   useEffect(() => {
      if(open){
         reset(defaultValues);
      }
   },[open])

    return (
      <>
         <SimpleModal
            open={open}
            setOpen={setOpen}
            title="Nova Transferência"
            actions={
               <Stack flex={1} justifyContent="flex-end" alignItems="flex-end">
                  <Button variant="contained" size="medium" color="secondary" onClick={handleSubmit(handleSave)}>
                     Salvar
                  </Button>
               </Stack>
            }
            style= {{
               width: { xs: 280, lg: 1280 },
               maxHeight: '90vh',
               overflowY: 'auto',
            }}
         >
            <Grid item xs={12} marginBottom={2}>
               <SubCard title="Detalhes Origem">
                  <Grid container spacing={2}>
                     <Grid item xs={6}>
                        <SelectForm
                           name="doc_escritorio_origem_id"
                           control={control}
                           label="Escritório:"
                           options={escritorios ?? []}
                           onChange={(e, item) => handleChangeEscritorio('origem', item?.id)}
                           error={ errors?.doc_escritorio_origem_id?.message }
                        />
                     </Grid>
                     {/* <Grid item xs={4}>
                        <SelectForm
                           name="doc_centro_custo_origem_id"
                           control={control}
                           label="Centro de Custo:"
                           options={centrosCusto ?? []}
                           error={ errors?.doc_centro_custo_origem_id?.message }
                        />
                     </Grid> */}
                     <Grid item xs={6}>
                        <SelectForm
                           name="doc_funcionario_origem_id"
                           control={control}
                           label="Funcionário:"
                           options={funcionariosOrigemFiltrados ?? []}
                           onChange={(e, item) => handleChangeFuncionario('origem', item?.id)}
                           error={ errors?.doc_funcionario_origem_id?.message }
                        />
                     </Grid>
                  </Grid>
               </SubCard>
            </Grid>
            <Grid item xs={12} marginBottom={2}>
               <SubCard title="Detalhes Destino">
                  <Grid container spacing={2}>
                     <Grid item xs={4}>
                        <SelectForm
                           name="doc_escritorio_destino_id"
                           control={control}
                           label="Escritório:"
                           options={escritorios ?? []}
                           onChange={(e, item) => handleChangeEscritorio('destino', item?.id)}
                           disabled={disabledEscritorioDestino ? true : false}
                           error={ errors?.doc_escritorio_destino_id?.message }
                        />
                     </Grid>
                     <Grid item xs={4}>
                        <SelectForm
                           name="doc_centro_custo_destino_id"
                           control={control}
                           label="Centro de Custo:"
                           options={centrosCusto ?? []}
                           error={ errors?.doc_centro_custo_destino_id?.message }
                        />
                     </Grid>
                     <Grid item xs={4}>
                        <SelectForm
                           name="doc_funcionario_destino_id"
                           control={control}
                           label="Funcionário:"
                           options={funcionariosDestinoFiltrados ?? []}
                           onChange={(e, item) => handleChangeFuncionario('destino', item?.id)}
                           disabled={disabledFuncionarioDestino ? true : false}
                           error={ errors?.doc_funcionario_destino_id?.message }
                        />
                     </Grid>
                  </Grid>
               </SubCard>
            </Grid>
            <Grid item xs={12}>
               <SubCard title={
                     <Stack display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle1' fontSize={15}>Ativos</Typography>
                           <Button variant='outlined' color='success' sx={{height: '40px'}} onClick={handleGetItens}>
                              Adicionar Itens
                              <PlaylistAddIcon sx={{marginLeft: '5px'}}/>
                           </Button>
                     </Stack>
                  }
               >
                  {
                     fields.length > 0 ?
                        <TableContainer sx={{overflowY: 'auto', maxHeight: '70vh'}}>
                           <Table>
                              <TableHead>
                                 <TableRow>
                                       <TableCell>Tipo</TableCell>
                                       <TableCell>Fabricante/Modelo</TableCell>
                                       <TableCell>Patrimônio</TableCell>
                                       <TableCell>Quantidade</TableCell>
                                       <TableCell sx={{ pr: 3 }}>
                                          Ação
                                       </TableCell>
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {
                                    fields.map((field, index) => (
                                       <TableRow hover key={index}>
                                          <TableCell>
                                             { field?.ativos?.tipo_ativo?.tpa_nome ?? 'Sem Tipo' }
                                          </TableCell>
                                          <TableCell>
                                             { field?.ativos?.fabricante_ativo?.fab_nome ?? 'Sem Fabricante' }/
                                             { field?.ativos?.modelo_ativo?.mod_nome ?? 'Sem Modelo' }
                                          </TableCell>
                                          <TableCell>{!field.ativos.ati_patrimonio ? 'Sem Patrimônio' : field.ativos.ati_patrimonio}</TableCell>
                                          <TableCell>{field.ine_qtd}</TableCell>
                                          <TableCell>
                                             <Button variant="outlined" size="small" color="error" onClick={()=> removerItems(fields.length, index)}>
                                                Remover
                                             </Button>   
                                          </TableCell>
                                       </TableRow>
                                    ))
                                 }
                              </TableBody>
                           </Table>
                        </TableContainer>
                     :
                        <Grid item xs={12}>
                           <Typography variant="body2" textAlign='center' fontSize={16}>Nenhum item adicionado</Typography>
                        </Grid>
                  }
               </SubCard>
            </Grid>
         </SimpleModal>

         <AddItensTransferencia open={openAddItens} setOpen={setOpenAddItens} handleAddItens={handleAddItens} itensTransferencia={itensTransferencia} inventario={inventario} centroCustoOrigem={centroCustoOrigem}/>
      </>
    );
};

export default NovaTransferencia;
