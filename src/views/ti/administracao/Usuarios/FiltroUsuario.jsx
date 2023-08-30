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

// Form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { InputForm } from '../../../../components/InputForm';

// Hooks
import { SelectForm } from '../../../../components/SelectForm';

const schema = yup.object({
   usu_is_ativo: yup.boolean()
});

// ==============================|| FILTRO USUÁRIO ||============================== //

const FiltroUsuario = ({ open, handleDrawerOpen, filtro, handleFiltro, funcionarios, escritorios, gruposUsuarios }) => {

   const { reset, control, setValue, handleSubmit, watch } = useForm({ resolver: yupResolver(schema) });

   const atributos = [
      { id: true, label: 'Ativo' },
      { id: false, label: 'Inativo' },
   ]

   const statusSelecionado = watch('usu_is_ativo');

   useEffect(() => {
      if(open && filtro){
         reset(filtro);
      }else{
         reset({})
      }
   }, [filtro, open])

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
                        <Grid container spacing={2}>
                           <Grid item xs={12}>
                              <Typography variant="h4">Filtrar Usuários</Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="usu_login"
                                 control={control}
                                 variant='outlined'
                                 label="Login:"
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="usu_nome"
                                 control={control}
                                 variant='outlined'
                                 label="Nome:"
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <SelectForm
                                 name="usu_funcionario_id"
                                 control={control}
                                 label="Funcionário:"
                                 options={funcionarios ?? []}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <SelectForm
                                 name="usu_escritorio_id"
                                 control={control}
                                 label="Escritório:"
                                 options={escritorios ?? []}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <SelectForm
                                 name="usu_grupo_id"
                                 control={control}
                                 label="Grupo de Usúario:"
                                 options={gruposUsuarios ?? []}
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
                                             onChange={(e)=> setValue('usu_is_ativo', e.target.value)}
                                             name="usu_is_ativo"
                                             id="usu_is_ativo"
                                          >
                                             {
                                                atributos.map((sta) => (
                                                   <FormControlLabel
                                                      key={sta.id}
                                                      value={sta.id}
                                                      control={
                                                         <Radio 
                                                            color={sta.id ? 'success' : 'error'}
                                                            sx={{ color: sta.id ? 'success.main' : 'error.main'}} 
                                                         
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

export default FiltroUsuario;