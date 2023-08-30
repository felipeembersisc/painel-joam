import { useEffect, useMemo, useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Drawer,
    Grid,
    Typography
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// project imports
import AnimateButton from '@/ui-component/extended/AnimateButton';

// Form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { InputForm } from '../../../../components/InputForm';
import { buscarAtributosAtivo } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { SelectForm } from '../../../../components/SelectForm';
import { DateInputForm } from '../../../../components/DateInputForm';

const schema = yup.object({
   // ati_nome: yup.string(),
   ati_patrimonio: yup.string(),
   ati_numero_serie: yup.string(),
   ati_status_id: yup.number(),
   ati_tipo_id: yup.number(),
   ati_tipo_novo: yup.string(),
   ati_categoria_tipo: yup.number(),
   ati_modelo_id: yup.number(),
   ati_modelo_novo: yup.string(),
   ati_fabricante_id: yup.number(),
   ati_fabricante_novo: yup.string(),
   ati_imei_1: yup.string(),
   ati_imei_2: yup.string(),
});

// ==============================|| KANBAN BACKLOGS - ADD STORY ||============================== //

const FiltroTransferencia = ({ open, handleDrawerOpen, filtro, handleFiltro, funcionarios, escritorios }) => {
   const { user } = useAuth();

   const { reset, control, setValue, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema), defaultValues: { ati_status_id: 1 } });

   const [atributos, setAtributos] = useState({});

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

         setValue('mostrar_novo_tipo', false);
         setValue('mostrar_novo_modelo', false);
         setValue('mostrar_novo_fabricante', false);
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
            onClose={()=> handleDrawerOpen(false)}
        >
            {open && (
               <Box sx={{ p: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={3}>
                           <Grid item xs={12}>
                              <Typography variant="h4">Filtrar Tranferências</Typography>
                           </Grid>
                           <Grid item xs={6}>
                              <DateInputForm
                                 name="data_gerado_inicio"
                                 control={control}
                                 label="Data Tranferência Inicio:"
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <DateInputForm
                                 name="data_gerado_fim"
                                 control={control}
                                 label="Data Tranferência Fim:"
                              />
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
                                 name="funcionario_origem_id"
                                 control={control}
                                 label='Funcionário Origem'
                                 options={funcionarios ?? []}
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <SelectForm
                                 name="funcionario_destino_id"
                                 control={control}
                                 label='Funcionário Destino'
                                 options={funcionarios ?? []}
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <SelectForm
                                 name="escritorio_origem_id"
                                 control={control}
                                 label='Escritório Origem'
                                 options={escritorios ?? []}
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <SelectForm
                                 name="escritorio_destino_id"
                                 control={control}
                                 label='Escritório Destino'
                                 options={escritorios ?? []}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <SelectForm
                                 name="funcionario_id"
                                 control={control}
                                 label='Responsável'
                                 options={funcionarios ?? []}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <Grid container alignItems="center" spacing={2}>
                                 <Grid item xs={12} md={2}>
                                    <Typography variant="subtitle1">Tipo:</Typography>
                                 </Grid>
                                 <Grid item xs={12} md={10}>
                                    <Grid container justifyContent="flex-start">
                                       <SelectForm
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
                                          name="ati_modelo_id"
                                          control={control}
                                          label="Modelo do Ativo:"
                                          options={atributos?.modelos ?? []}
                                       />
                                    </Grid>
                                 </Grid>
                              </Grid>
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="ati_imei"
                                 control={control}
                                 variant='outlined'
                                 label="Imei:"
                              />
                           </Grid>
                           {/* <Grid item xs={6}>
                              <SelectForm
                                 name="doc_assinado"
                                 control={control}
                                 label="Termo Assinado ?"
                                 options={[{id: true, label: 'Sim'}, {id: false, label: 'Não'}]}
                              />
                           </Grid> */}

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

export default FiltroTransferencia;
