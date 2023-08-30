import { useEffect, useState } from 'react';

// material-ui
import { Grid, IconButton, Stack, Button, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip } from '@mui/material';
import SubCard from '@/ui-component/cards/SubCard';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';

// Components
import { SelectForm } from '../../../../components/SelectForm';
import { InputForm } from '../../../../components/InputForm';
import { SimpleModal } from '../../../../components/Modal';

// Forms
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

// Services
import { salvarAtivosEscritorio } from '../../../../services/inventario';

// Modal
import SelecionarAtivosEscritorio from './SelecionarAtivosEscritorio';

const schema = yup.object({
   doc_centro_custo_destino_id: yup.number().when("mostrar_novo_centrocusto", { is: false, then: yup.number().nullable().transform((value) => isNaN(value) ? null : value).required('Campo Obrigatório') }),
   doc_nome_centrocusto: yup.string().when("mostrar_novo_centrocusto", { is: true, then: yup.string().required('Campo Obrigatório') }),
   doc_escritorio_destino_id: yup.number().nullable().transform((value) => isNaN(value) ? null : value).required('Campo obrigatório'),
   itens_documento: yup.array(yup.object())
});

const defaultValues = {
   doc_fornecedor_id: null,
   doc_escritorio_destino_id: null,
   doc_centro_custo_destino_id: null,
   mostrar_novo_centrocusto: false,
};

// ==============================|| ADD ATIVOS NO INVENTARIO ||============================== //

const AddAtivosEscritorio = ({ open, setOpen, escritorios, centrosCusto, getAtivos }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { control, setValue, watch, handleSubmit, reset, unregister, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
   const { fields, remove } = useFieldArray({ control, name: "itens_documento", shouldUnregister: true });

   const [openAddItens, setOpenAddItens] = useState(false);

   const itensDocumento = watch('itens_documento') ?? null;

   // Validações
   const novoCentroCusto = watch('mostrar_novo_centrocusto');

   function handleAddItens(data){
      let auxItens = [...itensDocumento, ...data];
      setValue('itens_documento', auxItens);
   }

   async function handleNewCentroCusto(){
      if(novoCentroCusto){
         unregister(['doc_nome_centrocusto']);
         setValue('mostrar_novo_centrocusto', false);
      }else{
         unregister('doc_centro_custo_destino_id');
         setValue('mostrar_novo_centrocusto', true);
      }
   }

   async function handleSave(data){
      handleLoad(true);
      const result = await salvarAtivosEscritorio(user, data);
      handleLoad(false);

      if(result?.gravado){
         await getAtivos(user);
         reset(defaultValues);
         setOpen(!open);
      }
   }

   useEffect(() => {
      reset(defaultValues);
      remove();
   },[open])

   return (
      <>
         <SimpleModal
            open={open}
            setOpen={setOpen}
            title="Adicionar Ativos"
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
               <SubCard title="Destino">
                  <Grid container spacing={2}>
                     <Grid item xs={6}>
                        <SelectForm
                           name="doc_escritorio_destino_id"
                           control={control}
                           label="Destino:"
                           options={escritorios ?? []}
                           error={ errors?.doc_escritorio_destino_id?.message }
                        />
                     </Grid>
                     <Grid item xs={6}>
                        <Grid container alignItems="center" spacing={2}>
                           {
                              novoCentroCusto ?
                                 <>
                                    <Grid item xs={10.7}>
                                       <InputForm
                                          name="doc_nome_centrocusto"
                                          control={control}
                                          variant='outlined'
                                          label="Centro de Custo:"
                                          error={errors?.doc_nome_centrocusto?.message}
                                       />
                                    </Grid>
                                    <Grid item xs={1}>
                                       <Tooltip placement="top" title="Cancelar">
                                          <IconButton color="error" aria-label="cancelar" size="large" onClick={()=> handleNewCentroCusto()}>
                                             <RemoveCircleOutlineIcon />
                                          </IconButton>
                                       </Tooltip>
                                    </Grid>
                                 </>
                              :
                                 <>  
                                    <Grid item xs={10.7}>
                                       <Grid container justifyContent="flex-start">
                                          <SelectForm
                                             name="doc_centro_custo_destino_id"
                                             control={control}
                                             label="Centro de Custo:"
                                             options={centrosCusto ?? []}
                                             error={ errors?.doc_centro_custo_destino_id?.message }
                                          />
                                       </Grid>
                                    </Grid>
                                    <Grid item xs={1}>
                                       <Tooltip placement="top" title="Novo">
                                          <IconButton color="success" aria-label="novo" size="large" onClick={()=> handleNewCentroCusto()}>
                                             <AddCircleOutlineIcon />
                                          </IconButton>
                                       </Tooltip>
                                    </Grid>
                                 </>
                           }
                        </Grid>
                     </Grid>
                  </Grid>
               </SubCard>
            </Grid>
            <Grid item xs={12}>
               <SubCard title={
                     <Stack display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle1' fontSize={15}>Ativos</Typography>
                           <Button variant='outlined' color='success' sx={{height: '40px'}} onClick={()=> setOpenAddItens(!openAddItens)}>
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
                                       <TableCell>Tipo/Fabricante/Modelo</TableCell>
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
                                             { field?.tipo_ativo?.tpa_nome ?? field?.tipoNome }/
                                             { field?.fabricante_ativo?.fab_nome ?? field?.fabricanteNome }/
                                             { field?.modelo_ativo?.mod_nome ?? field?.modeloNome }
                                          </TableCell>
                                          <TableCell>{field?.ati_patrimonio ?? 'Sem Patrimônio'}</TableCell>
                                          <TableCell>{field.ite_qtd}</TableCell>
                                          <TableCell>
                                             <Button variant="outlined" size="small" color="error" onClick={()=> remove(index)}>
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

         <SelecionarAtivosEscritorio open={openAddItens} setOpen={setOpenAddItens} handleAddItens={handleAddItens}/>
      </>
   );
};

export default AddAtivosEscritorio;