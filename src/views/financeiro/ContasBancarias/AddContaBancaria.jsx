import { useEffect } from 'react';

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
import { salvarContaBancaria } from '../../../services/financeiro';

// Form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';

// Components
import { InputForm } from '../../../components/InputForm';
import { SelectForm } from '../../../components/SelectForm';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';

const schema = yup.object({
   con_nome: yup.string().required('Nome obrigatório'),
   con_banco_id: yup.number().required('Banco obrigatório'),
   con_empresa_id: yup.number().required('Empresa obrigatória'),
   con_is_ativo: yup.boolean().required('Status Obrigatório')
});

const defaultValues = {
   con_nome: '',
   con_banco_id: null,
   con_empresa_id: null,
   con_is_ativo: true
};

const status = [
   { id: true, label: 'Ativa' },
   { id: false, label: 'Desativada' },
]

// ==============================|| ADD/EDIT CONTA BANCARIA ||============================== //

const AddEmpresa = ({ open, contaSelecionada, empresaSelecionada, bancos, handleCloseDrawer }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { reset, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

   const statusSelecionado = watch('con_is_ativo');

   async function handleSave(data){
      handleLoad(true);

      const result = await salvarContaBancaria(user, data);

      if(result){
         await handleCloseDrawer();
      }

      handleLoad(false);
   }

   useEffect(() => {
      reset(defaultValues);

      if(open && !contaSelecionada){
         reset({ con_empresa_id: empresaSelecionada.id, con_is_ativo: true });
      }

      if(open && contaSelecionada){
         reset(contaSelecionada);
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
                              <Typography variant="h4">{contaSelecionada ? 'Editar' : 'Adicionar'} Conta Bancária</Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="con_nome"
                                 control={control}
                                 variant='outlined'
                                 label="Nome:"
                                 error={errors?.con_nome?.message}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <SelectForm
                                 name="con_banco_id"
                                 control={control}
                                 label="Banco:"
                                 options={bancos ?? []}
                                 error={ errors?.con_banco_id?.message }
                              />
                           </Grid>

                           {
                              contaSelecionada &&
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
                                                onChange={(e)=> setValue('con_is_ativo', e.target.value)}
                                                name="con_is_ativo"
                                                id="con_is_ativo"
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

export default AddEmpresa;
