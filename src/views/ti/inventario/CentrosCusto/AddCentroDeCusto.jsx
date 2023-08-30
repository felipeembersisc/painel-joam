import { useMemo } from 'react';
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
import { salvarCentroCusto } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';

const schema = yup.object({
   cdc_nome: yup.string().required('Nome obrigatório'),
   cdc_ativo: yup.boolean().required('Status Obrigatório')
});

const defaultValues = {
   cdc_nome: '',
   cdc_ativo: true
};

const status = [
   { id: true, label: 'Ativo' },
   { id: false, label: 'Desativado' },
]

// ==============================|| ADD CENTRO DE CUSTO ||============================== //

const AddCentroDeCusto = ({ open, centroCustoSelecionado, getCentroCustoCloseDrawer }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { reset, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

   const statusSelecionado = watch('cdc_ativo');

   async function handleSave(data){
      handleLoad(true);

      const result = await salvarCentroCusto(user, data);

      if(result){
         await getCentroCustoCloseDrawer();
      }

      handleLoad(false);
   }

   useMemo(() => {
      if(open){
         reset(centroCustoSelecionado);
      }else{
         reset(defaultValues);
      }
   }, [open])

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
            onClose={()=> {
               getCentroCustoCloseDrawer()
               reset({ cdc_ativo: true })
            }}
        >
            {open && (
               <Box sx={{ p: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={3}>
                           <Grid item xs={12}>
                              <Typography variant="h4">Adicionar Centro de Custo</Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="cdc_nome"
                                 control={control}
                                 variant='outlined'
                                 label="Nome:"
                                 error={errors?.cdc_nome?.message}
                              />
                           </Grid>

                           {
                              centroCustoSelecionado &&
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
                                                onChange={(e)=> setValue('cdc_ativo', e.target.value)}
                                                name="cdc_ativo"
                                                id="cdc_ativo"
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
                           }

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

AddCentroDeCusto.propTypes = {
    open: PropTypes.bool,
    handleDrawerOpen: PropTypes.func
};

export default AddCentroDeCusto;
