import { useEffect, useState } from 'react';

// material-ui
import { Button, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

// Services
import { buscarQuantidadeAtivo, salvarQuantidadeAtivo } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';

// Components
import { SimpleModal } from '../../../../components/Modal';
import { DateTable } from '../../../../components/DataTable';

// Utils
import funcoes from '../../../../utils/funcoes';

// Forms
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { SelectForm } from '../../../../components/SelectForm';
import { InputForm } from '../../../../components/InputForm';
import { toast } from 'react-toastify';

const schema = yup.object({
   quantidades_ativos: yup.array(yup.object())
});

const schemaAdd = yup.object({
   ine_esc_id: yup.number().required('Campo Obrigatório'),
   ine_centro_custo_id: yup.number().required('Campo Obrigatório'),
   ine_qtd: yup.number().required('Campo Obrigatório'),
});

const defaultValues = {
   quantidades_ativos: [],
   index_alterados: []
};

const defaultValuesAdd = {
   ine_esc_id: null,
   ine_centro_custo_id: null,
   ine_qtd: '',
};

// ==============================|| GERENCIAR QUANTIDADE DOS ATIVOS ||============================== //

const GerenciarQuantidade = ({ open, setOpen, ativoSelecionado, setAtivoSelecionado, escritorios, centrosCusto }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { setValue, watch, reset } = useForm({ resolver: yupResolver(schema), defaultValues: defaultValues });
   const { control: controlAdd, setValue: setValueAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm({ resolver: yupResolver(schemaAdd), defaultValues: defaultValuesAdd });

   const [openAlterar, setOpenAlterar] = useState(false);
   const [itemSelecionado, setItemSelecionado] = useState(null);
   const [indexSelecionado, setIndexSelecionado] = useState(null);
   const [filtro, setFiltro] = useState('');
   const [qtdFiltrada, setQtdFiltrada] = useState([]);

   const quantidades = watch('quantidades_ativos');
   const indexAlterados = watch('index_alterados');

   function handleOpen(type, data, index){
      resetAdd(defaultValuesAdd);
      setItemSelecionado(null);

      switch(type){
         case 'novo':
            setValueAdd('ine_ativo_id', ativoSelecionado.ati_id);
            setOpenAlterar(!openAlterar);
         break;
         case 'editar':
            setItemSelecionado(data);
            resetAdd(data);
            setIndexSelecionado(index);
            setOpenAlterar(!openAlterar);
         break;
         case 'remover':
            let auxQtd = quantidades.filter((qtd, i) => i !== index);
            let auxInd = indexAlterados.filter((i) => i !== index);

            setValue('quantidades_ativos', auxQtd);
            setValue('index_alterados', auxInd);
         break;
      }
   }

   function handleAdicionar(data){
      let filtro = quantidades.filter(qtd => qtd.ine_esc_id == data.ine_esc_id && qtd.ine_centro_custo_id == data.ine_centro_custo_id);

      if(filtro.length > 0) {
         return toast.info('Registro já existente, altere a quantidade 😅');
      }

      setOpenAlterar(!openAlterar);
      setValue('index_alterados', [...indexAlterados, quantidades.length]);
      setValue('quantidades_ativos', [data, ...quantidades]);
      resetAdd(defaultValuesAdd);
   }

   function handleEditar(data){
      let auxQtd = [...quantidades];
      auxQtd[indexSelecionado] = data;

      if(!indexAlterados.includes(indexSelecionado)){
         setValue('index_alterados', [...indexAlterados, indexSelecionado]);
      }

      setValue('quantidades_ativos', auxQtd);
      setOpenAlterar(!openAlterar);
      resetAdd(defaultValuesAdd);
      setIndexSelecionado(null);
   }

   async function handleSave(){
      let quantidadesFiltradas = quantidades.filter((qtd, i) => indexAlterados.includes(i));

      if(quantidadesFiltradas.length <= 0){
         return toast.info('Nenhum item alterado 😅');
      }

      handleLoad(true);
      const result = await salvarQuantidadeAtivo(user, quantidadesFiltradas);
      
      if(result.gravado){
         setOpen(!open);
         reset(defaultValues);
         setAtivoSelecionado(null);
      }

      handleLoad(false);
   }

   function handleFilterInput(filter = null){
      if(quantidades.length > 0){
         if(filter && filter.length > 3){
            let aux = quantidades.filter(qtd => qtd.escritorio?.esc_nome?.toLowerCase().includes(filter?.toLowerCase()) ||  qtd.centro_de_custo?.cdc_nome?.toLowerCase()?.includes(filter?.toLowerCase()));
            setQtdFiltrada(aux);
         }else{
            setQtdFiltrada([]);
         }
      }else{
         setQtdFiltrada([]);
      }

      setFiltro(filter);
   }

   useEffect(()=> {
      setValue('quantidades_ativos', []);

      async function buscarAtivos(){
         handleLoad(true);
         const resultQuantidade = await buscarQuantidadeAtivo(user, ativoSelecionado?.ati_id);
         setValue('quantidades_ativos', resultQuantidade);
         handleLoad(false);
      }

      if(ativoSelecionado?.ati_id && open){
         buscarAtivos();
      }
   }, [open])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.ine_id, grow: 0 },
         { name: 'Escritório', selector: row => row.escritorio, grow: 2 },
         { name: 'Centro de Custo', selector: row => row.centro_custo, grow: 2 },
         { name: 'Qtd', selector: row => row.quantidade },
         { name: 'Ação', selector: row => row.acao, grow: 0 }
      ],
      rows:
         (qtdFiltrada.length > 0 ? qtdFiltrada : quantidades)?.map((x, index) => ({
            ine_id: x?.ine_id,
            escritorio: !x?.ine_id ? funcoes.camelCase(escritorios.find(esc => esc.id == x.ine_esc_id).label) : x?.escritorio?.esc_nome ? funcoes.camelCase(x.escritorio.esc_nome) : 'Sem Escritório',
            centro_custo: !x?.ine_id ? funcoes.camelCase(centrosCusto.find(cen => cen.id == x.ine_centro_custo_id).label) : x?.centro_de_custo?.cdc_nome ? funcoes.camelCase(x.centro_de_custo.cdc_nome) : 'Sem Centro de Custo',
            quantidade: x?.ine_qtd,
            acao: (
               <Stack direction="row" justifyContent="center" alignItems="center">
                  <Tooltip placement="top" title="Editar">
                     <IconButton color="primary" aria-label="editar" size="large" onClick={()=> handleOpen('editar', x, index)}>
                        <EditIcon sx={{ fontSize: '1.1rem' }} />
                     </IconButton>
                  </Tooltip>
                  {
                     !x.ine_id &&
                     <Tooltip placement="top" title="Remover">
                        <IconButton color="error" aria-label="editar" size="large" onClick={()=> handleOpen('remover', null, index)}>
                           <RemoveCircleIcon sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                     </Tooltip>
                  }
               </Stack>
            )
         }))
   };

   return (
      <>
         <SimpleModal
            open={open}
            setOpen={setOpen}
            title="Quantidades do ativo"
            actions={
               <Stack flex={1} justifyContent="flex-end" alignItems="flex-end">
                  <Button variant="contained" size="medium" color="secondary" onClick={handleSave}>
                     Salvar
                  </Button>
               </Stack>
            }
            style= {{
               width: { xs: 280, lg: 1280 },
               height: { minHeight: 500 },
               maxHeight: '90vh',
               overflowY: 'auto',
            }}
         >
            <Grid item xs={12}>
                  <Grid container spacing={2}>
                     <Grid item xs={12}>
                        <Tooltip title="Adicionar Quantidade">
                           <Button
                              variant="contained"
                              size="small"
                              color="secondary"
                              onClick={()=> handleOpen('novo')}
                              endIcon={<AddIcon />}
                           >
                              ADICIONAR
                           </Button>
                        </Tooltip>
                     </Grid>
                     <Grid item xs={12}>
                        <InputForm
                           name="pesquisa_itens"
                           label='Pesquisar:'
                           variant='outlined'
                           value={filtro}
                           onChange={(e) => handleFilterInput(e.target.value)}
                        />
                     </Grid>
                     <DateTable
                        linhas={datatable.rows || []}
                        colunas={datatable.columns || []}
                        options={{
                           pagination: false
                        }}
                     />
                  </Grid>
            </Grid>
         </SimpleModal>

         <SimpleModal
            open={openAlterar}
            setOpen={setOpenAlterar}
            title={`${itemSelecionado ? 'Alterar' : 'Adicionar'} Quantidade`}
            actions={
               <Stack flex={1} justifyContent="flex-end" alignItems="flex-end">
                  <Button variant="contained" size="medium" color="secondary" onClick={itemSelecionado ? handleSubmitAdd(handleEditar) : handleSubmitAdd(handleAdicionar)}>
                     {itemSelecionado ? 'Alterar' : 'Adicionar'}
                  </Button>
               </Stack>
            }
            style= {{
               width: { xs: 280, lg: 860 },
               height: { minHeight: 500 },
               maxHeight: '90vh',
               overflowY: 'auto'
            }}
         >
            <Grid item xs={12}>
                  <Grid container spacing={2}>
                     <Grid item xs={12}>
                        <SelectForm
                           name="ine_esc_id"
                           control={controlAdd}
                           label="Escritório:"
                           options={escritorios ?? []}
                           error={ errorsAdd?.ine_esc_id?.message }
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <SelectForm
                           name="ine_centro_custo_id"
                           control={controlAdd}
                           label="Centro de Custo:"
                           options={centrosCusto ?? []}
                           error={ errorsAdd?.ine_centro_custo_id?.message }
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <InputForm
                           name="ine_qtd"
                           type="number"
                           control={controlAdd}
                           variant='outlined'
                           label="Quantidade:"
                           error={errorsAdd?.ine_qtd?.message}
                        />
                     </Grid>
                  </Grid>
            </Grid>
         </SimpleModal>
      </>
   );
};

export default GerenciarQuantidade;
