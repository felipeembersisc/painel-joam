import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Box,
    Button,
    Drawer,
    Grid,
    Typography,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Tooltip,
    IconButton
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// project imports
import AnimateButton from '@/ui-component/extended/AnimateButton';

// Form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';

// Components
import { InputForm } from '../../../../components/InputForm';
import { buscarAtributosAtivo, salvarAtivo, validarAtivo, validarPatrimonio } from '../../../../services/inventario';
import { SelectForm } from '../../../../components/SelectForm';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { useLoad } from '../../../../hooks/useLoad';

const schema = yup.object({
   // ati_nome: yup.string().required('Nome obrigatório'),
   ati_patrimonio: yup.string().nullable(),
   ati_numero_serie: yup.string().nullable(),
   ati_status_id: yup.number().required('Status Obrigatório'),
   ine_esc_id: yup.number().nullable().when("ati_is_patrimonio", { is: true, then: yup.number().required('Escritório Obrigatório') }),
   ine_centro_custo_id: yup.number().nullable().when("ati_is_patrimonio", { is: true, then: yup.number().required('Centro de Custo Obrigatório') }),
   ati_tipo_id: yup.number().when("mostrar_novo_tipo", { is: false, then: yup.number().required('Tipo Obrigatório') }),
   ati_tipo_novo: yup.string().when("mostrar_novo_tipo", { is: true, then: yup.string().required('Tipo Obrigatório') }),
   ati_categoria_tipo: yup.number().when("mostrar_novo_tipo", { is: true, then: yup.number().required('Categoria Obrigatória') }),
   ati_modelo_id: yup.number().when("mostrar_novo_modelo", { is: false, then: yup.number().required('Modelo Obrigatório') }),
   ati_modelo_novo: yup.string().when("mostrar_novo_modelo", { is: true, then: yup.string().required('Modelo Obrigatório') }),
   ati_fabricante_id: yup.number().when("mostrar_novo_fabricante", { is: false, then: yup.number().required('Fabricante Obrigatório') }),
   ati_fabricante_novo: yup.string().when("mostrar_novo_fabricante", { is: true, then: yup.string().required('Fabricante Obrigatório') }),
   ati_imei_1: yup.string().nullable(),
   ati_imei_2: yup.string().nullable(),
});

const defaultValues = {
   // ati_nome: '',
   ati_patrimonio: '',
   ati_numero_serie: '',
   ati_status_id: 1,
   ine_esc_id: null,
   ine_centro_custo_id: null,
   ati_tipo_id: null,
   ati_fabricante_id: null,
   ati_modelo_id: null,
   ati_imei_1: '',
   ati_imei_2: '',
};

// ==============================|| ATIVOS ||============================== //

const AddAtivo = ({ open, handleDrawerOpen, ativoSelecionado, setAtivoSelecionado, getAtivosCloseDrawer, escritorios, centrosCusto }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { reset, control, unregister, setValue, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema), defaultValues });

   const [atributos, setAtributos] = useState({});

   const novoTipo = watch('mostrar_novo_tipo');
   const novoModelo = watch('mostrar_novo_modelo');
   const novoFabricante = watch('mostrar_novo_fabricante');
   const statusSelecionado = watch('ati_status_id');
   const isPatrimonio = watch('ati_is_patrimonio');

   async function buscarAtributos(){
      const result = await buscarAtributosAtivo(user);
      setAtributos(result);
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

   async function handleSave(data){
      handleLoad(true);

      if(data.ati_tipo_id && data.ati_modelo_id && data.ati_fabricante_id && !data.ati_patrimonio){
         const validar = await validarAtivo(user, data.ati_tipo_id, data.ati_modelo_id, data.ati_fabricante_id);
         if(validar){
            handleLoad(false);
            return toast.info('Ativo já existe, controle a quantidade! 😅');
         }
      }

      const result = await salvarAtivo(user, data);
      if(result){
         await getAtivosCloseDrawer();
         await buscarAtributos();
         handleDrawerOpen(!open);
         reset(defaultValues);
      }

      handleLoad(false);
   }

   async function verificarPatrimonio(patrimonio){
      if(patrimonio){
         handleLoad(true);
         const result = await validarPatrimonio(user, patrimonio);
         if(result.length > 0){
            toast.info('Patrimônio já cadastrado 😅');
            setValue('ati_patrimonio', '');
            setValue('ati_is_patrimonio', false);
         }else{
            setValue('ati_is_patrimonio', true);
         }
         handleLoad(false);
      }else{
         setValue('ati_is_patrimonio', false);
      }
   }

   useEffect(() => {
      reset(defaultValues);

      async function initComponent() {
         await buscarAtributos();

         setValue('mostrar_novo_tipo', false);
         setValue('mostrar_novo_modelo', false);
         setValue('mostrar_novo_fabricante', false);
         setValue('ati_is_patrimonio', false);

         if(ativoSelecionado){
            reset(ativoSelecionado);

            if(ativoSelecionado.ati_patrimonio){
               setValue('ati_is_patrimonio', true);
            }
         }
      }

      if(open){
         initComponent();
      }else{
         setAtivoSelecionado(null);
      }
   },[open])

    return (
        <Drawer
            sx={{
                ml: open ? 3 : 0,
                flexShrink: 0,
                zIndex: 1200,
                overflowX: 'hidden',
                width: { xs: 320, md: 450 },
                '& .MuiDrawer-paper': {
                    height: '100vh',
                    width: { xs: 320, md: 550 },
                    position: 'fixed',
                    border: 'none',
                    borderRadius: '0px'
                }
            }}
            variant="temporary"
            anchor="right"
            open={open}
            ModalProps={{ keepMounted: true }}
            onClose={()=> handleDrawerOpen(!open) }
        >
            {open && (
               <Box sx={{ p: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={3}>
                           <Grid item xs={12}>
                              <Typography variant="h4">Adicionar Ativo</Typography>
                           </Grid>
                           {/* <Grid item xs={12}>
                              <InputForm
                                 name="ati_nome"
                                 control={control}
                                 variant='outlined'
                                 label="Nome:"
                                 error={errors?.ati_nome?.message}
                              />
                           </Grid> */}
                           <Grid item xs={12}>
                              <Grid container alignItems="center" spacing={2}>
                                 {
                                    novoTipo ?
                                       <>
                                          <Grid item xs={12}>
                                             <Typography variant="subtitle1">Tipo:</Typography>
                                          </Grid>
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
                                                error={ errors?.ati_categoria_tipo?.message }
                                             />
                                          </Grid>
                                          <Grid item xs={2} md={2}>
                                             <Tooltip placement="top" title="Cancelar">
                                                <IconButton color="error" aria-label="cancelar" size="large" onClick={()=> handleNewDados('tipo')}>
                                                   <RemoveCircleIcon />
                                                </IconButton>
                                             </Tooltip>
                                          </Grid>
                                       </>
                                    :
                                       <>     
                                          <Grid item xs={12} md={2}>
                                             <Typography variant="subtitle1">Tipo:</Typography>
                                          </Grid>
                                          <Grid item xs={10} md={8}>
                                             <Grid container justifyContent="flex-start">
                                                <SelectForm
                                                   name="ati_tipo_id"
                                                   control={control}
                                                   label="Tipo do Ativo:"
                                                   options={atributos?.tipos ?? []}
                                                   error={ errors?.ati_tipo_id?.message }
                                                />
                                             </Grid>
                                          </Grid>
                                          <Grid item xs={2} md={2}>
                                             <Tooltip placement="top" title="Novo">
                                                <IconButton color="success" aria-label="novo" size="large" onClick={()=> handleNewDados('tipo')}>
                                                   <AddCircleIcon />
                                                </IconButton>
                                             </Tooltip>
                                          </Grid>
                                       </>
                                 }
                              </Grid>
                           </Grid>
                           <Grid item xs={12}>
                              <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} md={2}>
                                       <Typography variant="subtitle1">Fabricante:</Typography>
                                    </Grid>
                                    <Grid item xs={10} md={8}>
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
                                                   error={ errors?.ati_fabricante_id?.message }
                                                />
                                          }
                                       </Grid>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                    <Tooltip placement="top" title={novoFabricante ? 'Cancelar' : 'Novo'}>
                                       <IconButton color={novoFabricante ? 'error' : 'success'} aria-label={novoFabricante ? 'cancelar' : 'novo'} size="large" onClick={()=> handleNewDados('fabricante')}>
                                          {
                                             novoFabricante ?
                                                <RemoveCircleIcon />
                                             :
                                                <AddCircleIcon />
                                          }
                                       </IconButton>
                                    </Tooltip>
                                 </Grid>
                              </Grid>
                           </Grid>
                           <Grid item xs={12}>
                              <Grid container alignItems="center" spacing={2}>
                                 <Grid item xs={12} md={2}>
                                    <Typography variant="subtitle1">Modelo:</Typography>
                                 </Grid>
                                    <Grid item xs={10} md={8}>
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
                                                   error={ errors?.ati_modelo_id?.message }
                                                />
                                          }
                                       </Grid>
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                    <Tooltip placement="top" title={novoModelo ? 'Cancelar' : 'Novo'}>
                                       <IconButton color={novoModelo ? 'error' : 'success'} aria-label={novoModelo ? 'cancelar' : 'novo'} size="large" onClick={()=> handleNewDados('modelo')}>
                                          {
                                             novoModelo ?
                                                <RemoveCircleIcon />
                                             :
                                                <AddCircleIcon />
                                          }
                                       </IconButton>
                                    </Tooltip>
                                 </Grid>
                              </Grid>
                           </Grid>
                           <Grid item xs={6}>
                              <InputForm
                                 name="ati_patrimonio"
                                 control={control}
                                 onBlur={(e)=> verificarPatrimonio(e.target.value)}
                                 variant='outlined'
                                 label="Patrimonio:"
                                 error={errors?.ati_patrimonio?.message}
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <InputForm
                                 name="ati_numero_serie"
                                 control={control}
                                 variant='outlined'
                                 label="Nº de Série:"
                                 error={errors?.ati_numero_serie?.message}
                              />
                           </Grid>
                           {
                              isPatrimonio &&
                              <>
                                 <Grid item xs={6}>
                                    <SelectForm
                                       name="ine_esc_id"
                                       control={control}
                                       label="Escritório:"
                                       options={escritorios ?? []}
                                       readOnly={ ativoSelecionado ? true : false }
                                       error={ errors?.ine_esc_id?.message }
                                    />
                                 </Grid>
                                 <Grid item xs={6}>
                                    <SelectForm
                                       name="ine_centro_custo_id"
                                       control={control}
                                       label="Centro de Custo:"
                                       options={centrosCusto ?? []}
                                       readOnly={ ativoSelecionado ? true : false }
                                       error={ errors?.ine_centro_custo_id?.message }
                                    />
                                 </Grid>
                              </>
                           }
                           <Grid item xs={6}>
                              <InputForm
                                 name="ati_imei_1"
                                 control={control}
                                 variant='outlined'
                                 label="Imei 1:"
                                 error={errors?.ati_imei_1?.message}
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <InputForm
                                 name="ati_imei_2"
                                 control={control}
                                 variant='outlined'
                                 label="Imei 2:"
                                 error={errors?.ati_imei_2?.message}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="ati_observacao"
                                 control={control}
                                 variant='outlined'
                                 label="Observação:"
                                 multiline
                                 rows={3}
                                 error={errors?.ati_observacao?.message}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <Grid item xs={12} sm={4}>
                                 <Typography variant="subtitle1">Status:</Typography>
                              </Grid>
                              <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12}>
                                       <FormControl>
                                          <RadioGroup
                                             row
                                             aria-label="color"
                                             value={statusSelecionado}
                                             onChange={(e)=> setValue('ati_status_id', e.target.value)}
                                             name="ati_status_id"
                                             id="ati_status_id"
                                          >
                                             {
                                                atributos?.status?.map((sta) => (
                                                   <FormControlLabel
                                                      key={sta.id}
                                                      value={sta.id}
                                                      control={
                                                         <Radio 
                                                            color={sta.id == 1 ? 'success' : sta.id == 2 ? 'primary' : sta.id == 3 ? 'warning' : 'error'}
                                                            sx={{ color: sta.id == 1 ? 'success.main' : sta.id == 2 ? 'primary.main' : sta.id == 3 ? 'warning.main' : 'error.main'}} 
                                                         
                                                         />
                                                      }
                                                      label={sta.label}
                                                   />
                                                ))
                                             }
                                          </RadioGroup>
                                       </FormControl>
                                    </Grid>
                              </Grid>
                           </Grid>

                           <Grid item xs={12}>
                              <AnimateButton>
                                 <Button fullWidth variant="contained" type="submit" color='secondary' onClick={handleSubmit(handleSave)}>
                                    Salvar
                                 </Button>
                              </AnimateButton>
                           </Grid>
                        </Grid>
                  </LocalizationProvider>
               </Box>
            )}
        </Drawer>
    );
};

AddAtivo.propTypes = {
    open: PropTypes.bool,
    handleDrawerOpen: PropTypes.func
};

export default AddAtivo;
