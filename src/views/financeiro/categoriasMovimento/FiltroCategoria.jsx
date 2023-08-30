import { useEffect } from 'react';

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
import { useForm } from 'react-hook-form';
import { InputForm } from '../../../components/InputForm';

// ==============================|| FILTRO DE CATEGORIA MOVIMENTO ||============================== //

const FiltroCategoria = ({ open, handleDrawerOpen, filtro, handleFiltro }) => {
   const { reset, control, handleSubmit, formState: { errors } } = useForm();

   useEffect(() => {
      if(filtro){
         reset(filtro);
      }else{
         reset({})
      }
   }, [filtro])

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
                              <Typography variant="h4">Filtrar Categorias</Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="ctm_nome"
                                 control={control}
                                 variant='outlined'
                                 label="Nome:"
                                 error={errors?.ctm_nome?.message}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="ctm_descricao"
                                 control={control}
                                 variant='outlined'
                                 label="Descrição:"
                                 multiline
                                 rows={4}
                                 error={errors?.ctm_descricao?.message}
                              />
                           </Grid>

                           <Grid item xs={6}>
                              <AnimateButton>
                                 <Button fullWidth variant="contained" type="submit" color='secondary' onClick={()=> handleDrawerOpen(!open)}>
                                    Cancelar
                                 </Button>
                              </AnimateButton>
                           </Grid>
                           <Grid item xs={6}>
                              <AnimateButton>
                                 <Button fullWidth variant="contained" type="submit" color='success' onClick={handleSubmit(handleFiltro)}>
                                    Pesquisar
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

export default FiltroCategoria;
