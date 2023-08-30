import { useEffect, useMemo, useState } from 'react';

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
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// project imports
import AnimateButton from '@/ui-component/extended/AnimateButton';

// Form
import { useForm } from 'react-hook-form';
import { InputForm } from '../../../../components/InputForm';
import { buscarAtributosAtivo } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { SelectForm } from '../../../../components/SelectForm';

// ==============================|| FILTRO DE ATIVOS NO ESCRITORIO ||============================== //

const FiltroEscritorio = ({ open, handleDrawerOpen, filtro, handleFiltro, funcionarios, escritorios, centrosCusto }) => {
   const { user } = useAuth();

   const { reset, control, setValue, handleSubmit, watch } = useForm();

   const [atributos, setAtributos] = useState({});

   const statusSelecionado = watch('ati_status_id');

   async function buscarAtributos(){
      const result = await buscarAtributosAtivo(user);
      setAtributos(result);
   }

   useMemo(() => {
      if(filtro){
         reset(filtro);
      }else{
         reset({})
      }
   }, [filtro])

   useEffect(() => {
      async function initComponent() {
         await buscarAtributos();
      }

      if(open){
         initComponent();
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
            onClose={()=> handleDrawerOpen(!open)}
        >
            {open && (
               <Box sx={{ p: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={3}>
                           <Grid item xs={12}>
                              <Typography variant="h4">Filtrar Ativos</Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <Grid container alignItems="center" spacing={2}>
                                 <Grid item xs={12} md={2}>
                                    <Typography variant="subtitle1">Tipo:</Typography>
                                 </Grid>
                                 <Grid item xs={12} md={10}>
                                    <Grid container justifyContent="flex-start">
                                       <SelectForm
                                          multiple
                                          disableCloseOnSelect
                                          name="ati_tipo_id"
                                          control={control}
                                          label="Tipo do Ativo:"
                                          options={atributos?.tipos ?? []}
                                       />
                                    </Grid>
                                 </Grid>
                              </Grid>
                           </Grid>
                           <Grid item xs={12}>
                              <Grid container alignItems="center" spacing={2}>
                                 <Grid item xs={12} md={2}>
                                    <Typography variant="subtitle1">Fabricante:</Typography>
                                 </Grid>
                                 <Grid item xs={12} md={10}>
                                    <Grid container justifyContent="flex-start">
                                       <SelectForm
                                          multiple
                                          disableCloseOnSelect
                                          name="ati_fabricante_id"
                                          control={control}
                                          label="Fabricante do Ativo:"
                                          options={atributos?.fabricantes ?? []}
                                       />
                                    </Grid>
                                 </Grid>
                              </Grid>
                           </Grid>
                           <Grid item xs={12}>
                              <Grid container alignItems="center" spacing={2}>
                                 <Grid item xs={12} md={2}>
                                    <Typography variant="subtitle1">Modelo:</Typography>
                                 </Grid>
                                 <Grid item xs={12} md={10}>
                                    <Grid container justifyContent="flex-start">
                                       <SelectForm
                                          multiple
                                          disableCloseOnSelect
                                          name="ati_modelo_id"
                                          control={control}
                                          label="Modelo do Ativo:"
                                          options={atributos?.modelos ?? []}
                                       />
                                    </Grid>
                                 </Grid>
                              </Grid>
                           </Grid>
                           <Grid item xs={6}>
                              <InputForm
                                 name="ati_patrimonio"
                                 control={control}
                                 variant='outlined'
                                 label="Patrimonio:"
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <InputForm
                                 name="ati_numero_serie"
                                 control={control}
                                 variant='outlined'
                                 label="Nº de Série:"
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <SelectForm
                                 name="escritorio_id"
                                 control={control}
                                 label='Escritório'
                                 multiple
                                 disableCloseOnSelect
                                 options={escritorios ?? []}
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <SelectForm
                                 name="funcionario_id"
                                 control={control}
                                 label='Funcionário'
                                 options={funcionarios ?? []}
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <SelectForm
                                 name="centro_custo_id"
                                 control={control}
                                 label='Centro de Custo'
                                 options={centrosCusto ?? []}
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <InputForm
                                 name="ati_imei"
                                 control={control}
                                 variant='outlined'
                                 label="Imei:"
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
                                 <Button fullWidth variant="contained" type="submit" color='secondary' onClick={handleSubmit(handleFiltro)}>
                                    Buscar
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

export default FiltroEscritorio;