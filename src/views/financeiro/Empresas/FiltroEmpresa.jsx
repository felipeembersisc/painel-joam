import { useMemo } from 'react';

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
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { InputForm } from '../../../components/InputForm';

const schema = yup.object({
   emp_is_ativo: yup.boolean().nullable()
});

const status = [
   { id: true, label: 'Ativo' },
   { id: false, label: 'Desativado' },
]

// ==============================|| FILTRO DE EMPRESA ||============================== //

const FiltroEmpresa = ({ open, handleDrawerOpen, filtro, handleFiltro }) => {
   const { reset, control, setValue, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

   const statusSelecionado = watch('emp_is_ativo');

   useMemo(() => {
      if(filtro){
         reset(filtro);
      }else{
         reset({ emp_is_ativo: null })
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
                              <Typography variant="h4">Filtrar Empresa</Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="emp_nome"
                                 control={control}
                                 variant='outlined'
                                 label="Nome:"
                                 error={errors?.emp_nome?.message}
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
                                             onChange={(e)=> setValue('emp_is_ativo', e.target.value)}
                                             name="emp_is_ativo"
                                             id="emp_is_ativo"
                                          >
                                             {
                                                status.map((sta) => (
                                                   <FormControlLabel
                                                      key={sta.id}
                                                      value={sta.id}
                                                      control={
                                                         <Radio 
                                                            color={sta.id == true ? 'success' : 'error'}
                                                            sx={{ color: sta.id == true ? 'success.main' : 'error.main'}} 
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

export default FiltroEmpresa;
