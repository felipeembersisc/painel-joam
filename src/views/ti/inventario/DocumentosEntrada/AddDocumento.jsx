import { useEffect, useState } from 'react';

// material-ui
import { Grid, IconButton, Stack, Button, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, InputAdornment, Tooltip } from '@mui/material';
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
import { DateInputForm } from '../../../../components/DateInputForm';
import { toast } from 'react-toastify';

// Utils
import funcoes from '../../../../utils/funcoes';

// Forms
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

// Services
import { buscarDetalhesDocumento, buscarUrlDocumento, salvarEntradaDocumento, validarNumeroNota } from '../../../../services/inventario';

// Modal
import AddItensDocumento from './AddItensDocumento';
import { Visibility } from '@mui/icons-material';

const schema = yup.object({
   doc_numero_nota: yup.string().required('Campo obrigatório'),
   doc_serie_nota: yup.string().required('Campo obrigatório'),
   doc_centro_custo_destino_id: yup.number().when("mostrar_novo_centrocusto", { is: false, then: yup.number().nullable().transform((value) => isNaN(value) ? null : value).required('Campo Obrigatório') }),
   doc_nome_centrocusto: yup.string().when("mostrar_novo_centrocusto", { is: true, then: yup.string().required('Campo Obrigatório') }),
   doc_escritorio_destino_id: yup.number().nullable().transform((value) => isNaN(value) ? null : value).required('Campo obrigatório'),
   doc_nota_gerada_em: yup.string().required('Campo obrigatório'),
   doc_valor_total: yup.string().required('Campo obrigatório'),
   documento: yup.string().required('Campo obrigatório'),
   itens_documento: yup.array(yup.object())
});

const defaultValues = {
   doc_fornecedor_id: null,
   doc_escritorio_destino_id: null,
   doc_centro_custo_destino_id: null,
   mostrar_novo_centrocusto: false,
};

// ==============================|| ADD DOCUMENTO ||============================== //

const AddDocumento = ({ open, setOpen, escritorios, fornecedores, centrosCusto, documentoId, getDocumentos }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { control, setValue, getValues, watch, handleSubmit, reset, unregister, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
   const { fields, remove } = useFieldArray({ control, name: "itens_documento", shouldUnregister: true });

   const [openAddItens, setOpenAddItens] = useState(false);

   const itensDocumento = watch('itens_documento') ?? null;
   const urlDocumento = watch('doc_url') ?? null;

   // Validações
   const novoCentroCusto = watch('mostrar_novo_centrocusto');

   function handleAddItens(data){
      let auxItens = [...itensDocumento, ...data];
      setValue('itens_documento', auxItens);
   }

   async function handleBlur(acao){
      switch (acao) {
         case 'validarNumeroNota':
            const data = getValues();
            
            if(data.doc_numero_nota, data.doc_serie_nota, data.doc_fornecedor_id){
               handleLoad(true);
               const validar = await validarNumeroNota(user, data.doc_numero_nota, data.doc_serie_nota, data.doc_fornecedor_id);
               if(validar.count > 0) {
                  setValue('doc_numero_nota', '');
                  setValue('doc_serie_nota', '');
                  toast.info('Nota já registrada no sistema 😅');
               }
               handleLoad(false);
            }
         break;
      
         default:
         break;
      }
   }

   async function handleSave(data){
      
      let file = document.getElementById('documento').files;
      let fileValidado = await funcoes.validarArquivo(file, ['application/pdf'], 2);
      
      if(data.itens_documento.length <= 0) return toast.info('Insira ao menos um item na nota 😅');
      if(!fileValidado) return;

      handleLoad(true);
      const result = await salvarEntradaDocumento(user, { ...data, documento: fileValidado });
      handleLoad(false);

      if(result?.gravado){
         await getDocumentos(user);
         reset(defaultValues);
         setOpen(!open);
      }
   }

   async function getUrlDocumento(){
      handleLoad(true);
      await buscarUrlDocumento(user, urlDocumento);
      handleLoad(false);
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

   useEffect(() => {
      reset(defaultValues);

      async function getDetalhesDocumento(){
         const result = await buscarDetalhesDocumento(user, documentoId);
         if(result.length > 0){
            const itens = result[0].itens_documento;

            let auxResult = {};
            let auxItens = [];

            if(itens?.length > 0){
               itens.map(item => {
                  let auxItem = { ...item, ite_valor_unitario: funcoes.formatarMoeda(item.ite_valor_unitario) };
                  delete auxItem?.ativos;

                  auxItens.push({...auxItem, ...item.ativos });
               })
            }
            
            auxResult = { ...result[0], doc_valor_total: funcoes.formatarMoeda(result[0].doc_valor_total), itens_documento: auxItens };

            reset(auxResult);
         }
      }

      if(open && documentoId){
         getDetalhesDocumento();
      }else if(open && !documentoId){
         reset(defaultValues);
         remove();
      }
   },[open])

   return (
      <>
         <SimpleModal
            open={open}
            setOpen={setOpen}
            title="Adicionar Documento"
            actions={
               !documentoId &&
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
               <SubCard title="Detalhes">
                  <Grid container spacing={2}>
                     <Grid item xs={4}>
                        <InputForm
                           name="doc_numero_nota"
                           control={control}
                           label='Número da Nota:'
                           variant='outlined'
                           onBlur={()=> handleBlur('validarNumeroNota')}
                           disabled={documentoId ? true : false}
                           error={ errors?.doc_numero_nota?.message }
                        />
                     </Grid>
                     <Grid item xs={4}>
                        <InputForm
                           name="doc_serie_nota"
                           control={control}
                           label='Série da Nota:'
                           variant='outlined'
                           onBlur={()=> handleBlur('validarNumeroNota')}
                           disabled={documentoId ? true : false}
                           error={ errors?.doc_serie_nota?.message }
                        />
                     </Grid>
                     <Grid item xs={4}>
                        <InputForm
                           name="doc_valor_total"
                           type="money"
                           control={control}
                           label='Valor da Nota:'
                           variant='outlined'
                           disabled={documentoId ? true : false}
                           error={ errors?.doc_valor_total?.message }
                        />
                     </Grid>
                     <Grid item xs={6}>
                        <Grid container alignItems="center" spacing={2}>
                           <Grid item xs={10.7}>
                              <Grid container justifyContent="flex-start">
                                 <SelectForm
                                    name="doc_fornecedor_id"
                                    control={control}
                                    label="Fornecedor:"
                                    onBlur={()=> handleBlur('validarNumeroNota')}
                                    options={fornecedores ?? []}
                                    disabled={documentoId ? true : false}
                                    error={ errors?.doc_fornecedor_id?.message }
                                 />
                              </Grid>
                           </Grid>
                        </Grid>
                     </Grid>
                     <Grid item xs={6}>
                        <SelectForm
                           name="doc_escritorio_destino_id"
                           control={control}
                           label="Destino:"
                           options={escritorios ?? []}
                           disabled={documentoId ? true : false}
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
                                             disabled={documentoId ? true : false}
                                             error={ errors?.doc_centro_custo_destino_id?.message }
                                          />
                                       </Grid>
                                    </Grid>
                                    <Grid item xs={1}>
                                       <Tooltip placement="top" title="Novo">
                                          <IconButton color="success" aria-label="novo" size="large" onClick={()=> handleNewCentroCusto()} disabled={documentoId ? true : false}>
                                             <AddCircleOutlineIcon />
                                          </IconButton>
                                       </Tooltip>
                                    </Grid>
                                 </>
                           }
                        </Grid>
                     </Grid>
                     <Grid item xs={6}>
                        <DateInputForm
                           name="doc_nota_gerada_em"
                           control={control}
                           label="Data da Nota:"
                           disabled={documentoId ? true : false}
                           error={ errors?.doc_nota_gerada_em?.message }
                        />
                     </Grid>
                     <Grid item xs={12}>
                        {
                           documentoId ?
                              <InputForm
                                 name="doc_url"
                                 label='Documento:'
                                 value={urlDocumento ? urlDocumento.split('/')[2] : 'Documento não enviado'}
                                 disabled={documentoId ? true : false}
                                 endAdornment={
                                    urlDocumento ?
                                       <InputAdornment position="end" sx={{paddingRight: '10px'}}>
                                          <IconButton
                                             aria-label="toggle password visibility"
                                             onClick={getUrlDocumento}
                                             edge="end"
                                          >
                                             <Visibility />
                                          </IconButton>
                                       </InputAdornment>
                                    :
                                       <></>
                                 }
                              />
                           :
                              <InputForm
                                 id='documento'
                                 name="documento"
                                 control={control}
                                 variant='outlined'
                                 type="file"
                                 error={ errors?.documento?.message }
                              />
                        }
                     </Grid>
                  </Grid>
               </SubCard>
            </Grid>
            <Grid item xs={12}>
               <SubCard title={
                     <Stack display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle1' fontSize={15}>Ativos</Typography>
                           {
                              !documentoId &&
                              <Button variant='outlined' color='success' sx={{height: '40px'}} onClick={()=> setOpenAddItens(!openAddItens)}>
                                 Adicionar Itens
                                 <PlaylistAddIcon sx={{marginLeft: '5px'}}/>
                              </Button>
                           }
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
                                       <TableCell>Valor Unitário</TableCell>
                                       {
                                          !documentoId &&
                                          <TableCell sx={{ pr: 3 }}>
                                             Ação
                                          </TableCell>
                                       }
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {
                                    fields.map((field, index) => (
                                       <TableRow hover key={index}>
                                          <TableCell>
                                             { !documentoId ? (field.tipoNome ?? field.ati_tipo_novo) : field?.tipo_ativo?.tpa_nome }/
                                             { !documentoId ? (field.fabricanteNome ?? field.ati_fabricante_novo) : field?.fabricante_ativo?.fab_nome }/
                                             { !documentoId ? (field.modeloNome ?? field.ati_modelo_novo) : field?.modelo_ativo?.mod_nome }
                                          </TableCell>
                                          <TableCell>{!field.ati_patrimonio ? 'Sem Patrimônio' : field.ati_patrimonio}</TableCell>
                                          <TableCell>{field.ite_qtd}</TableCell>
                                          <TableCell>{field.ite_valor_unitario}</TableCell>
                                          {
                                             !documentoId &&
                                             <TableCell>
                                                <Button variant="outlined" size="small" color="error" onClick={()=> remove(index)}>
                                                   Remover
                                                </Button>   
                                             </TableCell>
                                          }
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

         <AddItensDocumento open={openAddItens} setOpen={setOpenAddItens} handleAddItens={handleAddItens}/>
      </>
   );
};

export default AddDocumento;