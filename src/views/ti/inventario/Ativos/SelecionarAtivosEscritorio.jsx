import { useEffect, useState } from 'react';

// material-ui
import { Grid, Chip, IconButton, Stack, Button, Tooltip, FormControl, FormGroup, FormControlLabel, Switch, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import SubCard from '@/ui-component/cards/SubCard';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

// Services
import { buscarAtivosEntradaDocumento, buscarAtributosAtivo, validarPatrimonio } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';

// Components
import { SimpleModal } from '../../../../components/Modal';

// Utils
import { SelectForm } from '../../../../components/SelectForm';
import { InputForm } from '../../../../components/InputForm';

// Forms
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const schema = yup.object({
   ite_qtd: yup.number().required('Campo obrigatório'),
   ati_tipo_id: yup.number().nullable().when("mostrar_novo_tipo", { is: false, then: yup.number().required('Campo Obrigatório') }),
   ati_tipo_novo: yup.string().nullable().when("mostrar_novo_tipo", { is: true, then: yup.string().required('Campo Obrigatório') }),
   ati_categoria_tipo: yup.number().nullable().when("mostrar_novo_tipo", { is: true, then: yup.number().required('Campo Obrigatório') }),
   ati_modelo_id: yup.number().nullable().when("mostrar_novo_modelo", { is: false, then: yup.number().required('Campo Obrigatório') }),
   ati_modelo_novo: yup.string().nullable().when("mostrar_novo_modelo", { is: true, then: yup.string().required('Campo Obrigatório') }),
   ati_fabricante_id: yup.number().nullable().when("mostrar_novo_fabricante", { is: false, then: yup.number().required('Campo Obrigatório') }),
   ati_fabricante_novo: yup.string().nullable().when("mostrar_novo_fabricante", { is: true, then: yup.string().required('Campo Obrigatório') }),
});

const defaultValues = {
   ite_qtd: '',
   ati_tipo_id: null,
   ati_tipo_novo: '',
   ati_categoria_tipo: null,
   ati_modelo_id: null,
   ati_modelo_novo: '',
   ati_fabricante_id: null,
   ati_fabricante_novo: '',
   mostrar_novo_fabricante: false,
   mostrar_novo_modelo: false,
   mostrar_novo_tipo: false
}

// ==============================|| SELECIONAR OS ITENS PARA O INVENTARIO ||============================== //

const SelecionarItens = ({ open, setOpen, handleAddItens }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { reset, control, unregister, setValue, handleSubmit, watch, getValues, formState: { errors } } = useForm({ resolver: yupResolver(schema), defaultValues });

   const [ativos, setAtivos] = useState(null);
   const [ativosPesquisa, setAtivosPesquisa] = useState([]);
   const [atributos, setAtributos] = useState({});
   const [patrimonio, setPatrimonio] = useState('');
   const [patrimonios, setPatrimonios] = useState([]);
   const [checkPatrimonios, setCheckPatrimonios] = useState(false);

   // Modal
   const [openModalResultPesquisa, setOpenModalResultPesquisa] = useState(false);

   // Validações
   const novoTipo = watch('mostrar_novo_tipo');
   const novoModelo = watch('mostrar_novo_modelo');
   const novoFabricante = watch('mostrar_novo_fabricante');
   const qtdSelecionada = watch('ite_qtd');
   const valorPesquisa = watch('ati_pesquisa');

   async function getAtributos(){
      const result = await buscarAtributosAtivo(user);
      setAtributos(result);
   }

   async function getAtivos(){
      const result = await buscarAtivosEntradaDocumento(user);
      setAtivos(result);
   }

   async function verificarPatrimonio(patrimonio){
      if(patrimonio){
         const result = await validarPatrimonio(user, patrimonio);

         if(result.length > 0 || patrimonios.includes(patrimonio)){
            toast.info('Patrimônio já cadastrado 😅');
            setPatrimonio('');
            return false;
         }else{
            return true;
         }
      }
   }

   async function handleNewDados(campo){
      switch(campo){
         case 'tipo':
            if(novoTipo){
               unregister(['ati_tipo_novo', 'ati_categoria_tipo']);
               setValue('mostrar_novo_tipo', false);
            }else{
               unregister('ati_tipo_id');
               setValue('mostrar_novo_tipo', true);
            }
         break
         case 'modelo':
            if(novoModelo){
               unregister('ati_modelo_novo');
               setValue('mostrar_novo_modelo', false);
            }else{
               unregister('ati_modelo_id');
               setValue('mostrar_novo_modelo', true);
            }
         break
         case 'fabricante':
            if(novoFabricante){
               unregister('ati_fabricante_novo');
               setValue('mostrar_novo_fabricante', false);
            }else{
               unregister('ati_fabricante_id');
               setValue('mostrar_novo_fabricante', true);
            }
         break
      }
   }

   async function handleAddPatrimonios(patrimonio){
      if(patrimonio === ' '){
         return setPatrimonio('');
      }

      if(patrimonios.length == qtdSelecionada){
         setPatrimonio('');
         return toast.info('Você não pode adicionar mais patrimônios 😅');
      }
      
      if(patrimonio && patrimonio.includes(' ')){
         handleLoad(true);
         const validar = await verificarPatrimonio(patrimonio.replace(' ', ''));
         handleLoad(false);

         if(!validar){
            return setPatrimonio('');
         }

         setPatrimonios([
            ...patrimonios,
            patrimonio.replace(' ', '')
         ]);
         
         setPatrimonio('');
      }else{
         setPatrimonio(patrimonio);
      }
   }

   function handleRemovePatrimonios(indice){
      let auxPatrimonios = [...patrimonios];
      auxPatrimonios.splice(indice, 1);
      
      setPatrimonios(auxPatrimonios);
   }

   function handleCheckInserirPatrimonios(check){
      if(!check){
         setPatrimonios([]);
         setPatrimonio('');
      }

      if(!qtdSelecionada || qtdSelecionada <= 0){
         return toast.info('Informe a quantidade de itens 😅');
      }else{
         setCheckPatrimonios(check);
      }

   }

   function handlePesquisaAtivo(){
      if(!valorPesquisa){
         return toast.info('Informe um valor para a pesquisa 😅');
      }

      let auxValidacao = [];

      const resultPesquisa = ativos.filter(ativo => {
         let auxTipo = ativo.tipo_ativo?.tpa_nome.toLowerCase();
         let auxFabricante = ativo.fabricante_ativo.fab_nome?.toLowerCase();
         let auxModelo = ativo.modelo_ativo.mod_nome?.toLowerCase();
         let tipoFabricanteModelo = String(ativo.ati_tipo_id) + String(ativo.ati_fabricante_id) + String(ativo.ati_modelo_id);

         if((auxTipo.includes(valorPesquisa.toLowerCase()) || auxFabricante.includes(valorPesquisa.toLowerCase()) || auxModelo.includes(valorPesquisa.toLowerCase())) && !auxValidacao.includes(tipoFabricanteModelo)){
            auxValidacao.push(tipoFabricanteModelo);
            return ativo;
         }
      });

      if(resultPesquisa.length == 0){
         return toast.info('Nenhum ativo encontrado 😅');
      }else{
         setAtivosPesquisa(resultPesquisa);
         setOpenModalResultPesquisa(!openModalResultPesquisa);
      }
   }

   async function selecionarAtivo(ativo){
      let auxAtivo = { ...ativo };

      if(auxAtivo?.ati_patrimonio){
         delete auxAtivo.ati_patrimonio;
      }

      reset(auxAtivo);
      setOpenModalResultPesquisa(!openModalResultPesquisa)
   }

   function handleAdicionar(data){
      const { tipos, modelos, fabricantes } = atributos;
      let auxItens = [];

      let auxTipo = data.ati_tipo_id ? tipos.find(tip => tip.id === data.ati_tipo_id)?.label : null;
      let auxModelo = data.ati_modelo_id ? modelos.find(mod => mod.id === data.ati_modelo_id).label : null;
      let auxFabricante = data.ati_fabricante_id ? fabricantes.find(fab => fab.id === data.ati_fabricante_id).label : null;

      let auxData = { ...data, tipoNome: auxTipo, modeloNome: auxModelo, fabricanteNome: auxFabricante };
      Array('mostrar_novo_fabricante', 'mostrar_novo_modelo', 'mostrar_novo_tipo').map(item => delete auxData[item]);

      if(patrimonios.length > 0){
         delete auxData?.ati_id;

         patrimonios.map(pat => {
            auxItens.push({
               ...auxData,
               ati_patrimonio: pat,
               ite_qtd: 1,
               has_patrimonio: true
            })
         })
      }else{
         auxItens.push({...auxData, has_patrimonio: false});
      }

      handleAddItens(auxItens);
      setCheckPatrimonios(false);
      setPatrimonios([]);
      reset(defaultValues);
   }

   useEffect(() => {
      async function initComponent() {
         await getAtributos();
         await getAtivos();

         setValue('mostrar_novo_tipo', false);
         setValue('mostrar_novo_modelo', false);
         setValue('mostrar_novo_fabricante', false);
      }

      if(open){
         initComponent();
      }
   },[open])

   return (
      <>
         <SimpleModal
            open={open}
            setOpen={setOpen}
            title="Adicionar Itens"
            actions={
               <Stack flex={1} justifyContent="flex-end" alignItems="flex-end">
                  <Button variant="contained" size="medium" color="secondary" onClick={handleSubmit(handleAdicionar)}>
                     Adicionar
                  </Button>
               </Stack>
            }
            style= {{
               width: { xs: 280, lg: 1024 },
               maxHeight: '90vh',
               overflowY: 'auto',
            }}
         >
            <Grid item xs={12}>
               <SubCard title="Detalhes" sx={{marginBottom: '20px'}}>
                  <Grid container spacing={2}>
                     <Grid item xs={11}>
                        <InputForm
                           name="ati_pesquisa"
                           control={control}
                           variant='outlined'
                           label="Pesquisar ativo: ( Tipo, Modelo, Fabricante )"
                           error={errors?.ati_pesquisa?.message}
                        />
                     </Grid>
                     <Grid item xs={1}>
                        <Tooltip placement="top" title="Pesquisar">
                           <IconButton color="inherit" aria-label="pesquisar" size="large" onClick={()=> handlePesquisaAtivo()}>
                              <ManageSearchIcon fontSize='80px'/>
                           </IconButton>
                        </Tooltip>
                     </Grid>
                     <Grid item xs={6}>
                        <Grid container alignItems="center" spacing={2}>
                           {
                              novoTipo ?
                                 <>
                                    <Grid item xs={5}>
                                       <InputForm
                                          name="ati_tipo_novo"
                                          control={control}
                                          variant='outlined'
                                          label="Novo Tipo:"
                                          error={errors?.ati_tipo_novo?.message}
                                       />
                                    </Grid>
                                    <Grid item xs={5}>
                                       <SelectForm
                                          name="ati_categoria_tipo"
                                          control={control}
                                          label="Categoria do Tipo:"
                                          options={atributos?.categoriaTipos ?? []}
                                          error={errors?.ati_categoria_tipo?.message}
                                       />
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                       <Tooltip placement="top" title="Cancelar">
                                          <IconButton color="error" aria-label="cancelar" size="large" onClick={()=> handleNewDados('tipo')}>
                                             <RemoveCircleOutlineIcon />
                                          </IconButton>
                                       </Tooltip>
                                    </Grid>
                                 </>
                              :
                                 <>  
                                    <Grid item xs={10} md={10}>
                                       <Grid container justifyContent="flex-start">
                                          <SelectForm
                                             name="ati_tipo_id"
                                             control={control}
                                             label="Tipo do Ativo:"
                                             options={atributos?.tipos ?? []}
                                             error={errors?.ati_tipo_id?.message}
                                          />
                                       </Grid>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                       <Tooltip placement="top" title="Novo">
                                          <IconButton color="success" aria-label="novo" size="large" onClick={()=> handleNewDados('tipo')}>
                                             <AddCircleOutlineIcon />
                                          </IconButton>
                                       </Tooltip>
                                    </Grid>
                                 </>
                           }
                        </Grid>
                     </Grid>
                     <Grid item xs={6}>
                        <Grid container alignItems="center" spacing={2}>
                           <Grid item xs={10}>
                              <Grid container justifyContent="flex-start">
                                 {
                                    novoModelo ?
                                       <InputForm
                                          name="ati_modelo_novo"
                                          control={control}
                                          variant='outlined'
                                          label="Novo Modelo:"
                                          error={errors?.ati_modelo_novo?.message}
                                       />
                                    :
                                       <SelectForm
                                          name="ati_modelo_id"
                                          control={control}
                                          label="Modelo do Ativo:"
                                          options={atributos?.modelos ?? []}
                                          error={errors?.ati_modelo_id?.message}
                                       />
                                 }
                              </Grid>
                           </Grid>
                           <Grid item xs={2}>
                              <Tooltip placement="top" title={novoModelo ? 'Cancelar' : 'Novo'}>
                                 <IconButton color={novoModelo ? 'error' : 'success'} aria-label={novoModelo ? 'cancelar' : 'novo'} size="large" onClick={()=> handleNewDados('modelo')}>
                                    {
                                       novoModelo ?
                                          <RemoveCircleOutlineIcon />
                                       :
                                          <AddCircleOutlineIcon />
                                    }
                                 </IconButton>
                              </Tooltip>
                           </Grid>
                        </Grid>
                     </Grid>
                     <Grid item xs={6}>
                        <Grid container alignItems="center" spacing={2}>
                           <Grid item xs={10}>
                              <Grid container justifyContent="flex-start">
                                 {
                                    novoFabricante ?
                                       <InputForm
                                          name="ati_fabricante_novo"
                                          control={control}
                                          variant='outlined'
                                          label="Novo Fabricante:"
                                          error={errors?.ati_fabricante_novo?.message}
                                       />
                                    :
                                       <SelectForm
                                          name="ati_fabricante_id"
                                          control={control}
                                          label="Fabricante do Ativo:"
                                          options={atributos?.fabricantes ?? []}
                                          error={errors?.ati_fabricante_id?.message}
                                       />
                                 }
                              </Grid>
                           </Grid>
                           <Grid item xs={2}>
                              <Tooltip placement="top" title={novoFabricante ? 'Cancelar' : 'Novo'}>
                                 <IconButton color={novoFabricante ? 'error' : 'success'} aria-label={novoFabricante ? 'cancelar' : 'novo'} size="large" onClick={()=> handleNewDados('fabricante')}>
                                    {
                                       novoFabricante ?
                                          <RemoveCircleOutlineIcon />
                                       :
                                          <AddCircleOutlineIcon />
                                    }
                                 </IconButton>
                              </Tooltip>
                           </Grid>
                        </Grid>
                     </Grid>
                     <Grid item xs={5.7}>
                        <InputForm
                           name="ite_qtd"
                           type='number'
                           control={control}
                           variant='outlined'
                           label="Quantidade desse item:"
                           error={errors?.ite_qtd?.message}
                        />
                     </Grid>
                  </Grid>
               </SubCard>
               <SubCard title="Patrimônios">
                  <Grid container spacing={2}>
                     <Grid item xs={12}>
                        <Grid item xs={12} mb={2}>
                           <FormControl>
                              <FormGroup row>
                                    <FormControlLabel control={<Switch checked={checkPatrimonios} onChange={(e)=> handleCheckInserirPatrimonios(e.target.checked)}/>} label="Inserir Patrimônios ?" />
                              </FormGroup>
                           </FormControl>
                        </Grid>
                        {
                           patrimonios.length > 0 &&
                           <Grid container spacing={2}>
                              {
                                 patrimonios.map((pat, i) => (
                                    <Grid item key={`${pat}-${i}`}>
                                       <Chip label={String(pat)} variant="outlined" onDelete={()=> handleRemovePatrimonios(i)} />
                                    </Grid>
                                 ))
                              }
                           </Grid>
                        }
                        {
                           checkPatrimonios &&
                           <Grid item xs={4} mt={2}>
                              <InputForm
                                 name="ati_patrimonio"
                                 variant='outlined'
                                 label="Patrimônios:"
                                 value={patrimonio}
                                 onChange={(e)=> handleAddPatrimonios(e.target.value)}
                              />
                           </Grid>
                        }
                     </Grid>
                  </Grid>
               </SubCard>
            </Grid>
         </SimpleModal>

         <SimpleModal
            open={openModalResultPesquisa}
            setOpen={setOpenModalResultPesquisa}
            title="Resultado da Pesquisa"
            style= {{
               width: { xs: 280, lg: 840 }
            }}
         >  
            <TableContainer sx={{overflowY: 'auto', maxHeight: '70vh'}}>
               <Table>
                  <TableHead>
                     <TableRow>
                           {/* <TableCell sx={{ pl: 3 }}>Nome</TableCell> */}
                           <TableCell>Tipo</TableCell>
                           <TableCell>Fabricante</TableCell>
                           <TableCell>Modelo</TableCell>
                           <TableCell>
                              Ação
                           </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {ativosPesquisa &&
                           ativosPesquisa.map((row, index) => (
                              <TableRow hover key={index}>
                                 {/* <TableCell>{row.ati_pesquisa}</TableCell> */}
                                 <TableCell>{row.tipo_ativo.tpa_nome}</TableCell>
                                 <TableCell>{row.fabricante_ativo.fab_nome}</TableCell>
                                 <TableCell>{row.modelo_ativo.mod_nome}</TableCell>
                                 <TableCell>
                                    <Button variant="outlined" size="small" color="success" onClick={()=> selecionarAtivo(row)}>
                                       Selecionar
                                    </Button>   
                                 </TableCell>
                              </TableRow>
                           ))}
                  </TableBody>
               </Table>
            </TableContainer>
         </SimpleModal>
      </>
   );
};

export default SelecionarItens;