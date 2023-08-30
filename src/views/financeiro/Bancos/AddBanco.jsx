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

// Services
import { salvarBanco } from '../../../services/financeiro';

// Form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { InputForm } from '../../../components/InputForm';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';

const schema = yup.object({
   ban_nome: yup.string().required('Nome obrigatório'),
   ban_codigo: yup.string(),
   ban_is_ativo: yup.boolean().required('Status Obrigatório')
});

const defaultValues = {
   ban_nome: '',
   ban_is_ativo: true
};

const status = [
   { id: true, label: 'Ativo' },
   { id: false, label: 'Desativado' },
]

// ==============================|| ADD/EDIT BANCO ||============================== //

const AddBanco = ({ open, bancoSelecionado, handleCloseDrawer }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { reset, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

   const statusSelecionado = watch('ban_is_ativo');

   async function handleSave(data){
      handleLoad(true);

      const result = await salvarBanco(user, data);

      if(result){
         await handleCloseDrawer();
      }

      handleLoad(false);
   }

   useMemo(() => {
      if(open){
         reset(bancoSelecionado);
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
            onClose={handleCloseDrawer}
        >
            {open && (
               <Box sx={{ p: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={3}>
                           <Grid item xs={12}>
                              <Typography variant="h4">{bancoSelecionado ? 'Editar' : 'Adicionar'} Banco</Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="ban_nome"
                                 control={control}
                                 variant='outlined'
                                 label="Nome:"
                                 error={errors?.ban_nome?.message}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="ban_codigo"
                                 control={control}
                                 variant='outlined'
                                 label="Código:"
                                 error={errors?.ban_codigo?.message}
                              />
                           </Grid>

                           {
                              bancoSelecionado &&
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
                                                onChange={(e)=> setValue('ban_is_ativo', e.target.value)}
                                                name="ban_is_ativo"
                                                id="ban_is_ativo"
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

                           <Grid item xs={6}>
                              <AnimateButton>
                                 <Button fullWidth variant="contained" type="submit" color='secondary' onClick={handleCloseDrawer}>
                                    Cancelar
                                 </Button>
                              </AnimateButton>
                           </Grid>
                           <Grid item xs={6}>
                              <AnimateButton>
                                 <Button fullWidth variant="contained" type="submit" color='success' onClick={handleSubmit(handleSave)}>
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

export default AddBanco;
