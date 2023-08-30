import { useMemo } from 'react';

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

// Hooks
import { SelectForm } from '../../../../components/SelectForm';
import { DateInputForm } from '../../../../components/DateInputForm';

// ==============================|| FILTRO DE DOCUMENTO ENTRADA ||============================== //

const FiltroDocumento = ({ open, handleDrawerOpen, filtro, handleFiltro, escritorios, fornecedores }) => {

   const { reset, control, handleSubmit } = useForm();

   useMemo(() => {
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
            onClose={()=> handleDrawerOpen(false)}
        >
            {open && (
               <Box sx={{ p: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={3}>
                           <Grid item xs={12}>
                              <Typography variant="h4">Filtrar Documentos</Typography>
                           </Grid>
                           <Grid item xs={6}>
                              <DateInputForm
                                 name="nota_gerada_inicio"
                                 control={control}
                                 label="Nota gerada a partir de:"
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <DateInputForm
                                 name="nota_gerada_fim"
                                 control={control}
                                 label="Nota gerada até:"
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <SelectForm
                                 name="doc_escritorio_origem_id"
                                 control={control}
                                 label="Fornecedor:"
                                 options={fornecedores ?? []}
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <SelectForm
                                 name="doc_escritorio_destino_id"
                                 control={control}
                                 label="Destino:"
                                 options={escritorios ?? []}
                              />
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

export default FiltroDocumento;
