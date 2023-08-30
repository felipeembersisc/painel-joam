import { useMemo } from 'react';
import PropTypes from 'prop-types';

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
import { salvarGrupoUsuario } from '../../../../services/administracao';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';

const schema = yup.object({
   gru_nome: yup.string().required('Nome obrigatório'),
   gru_descricao: yup.string().required('Descrição obrigatória')
});

const defaultValues = {
   gru_nome: '',
   gru_descricao: ''
};

// ==============================|| ADD GRUPO USUÁRIO ||============================== //

const AddGrupoUsuario = ({ open, grupoSelecionado, getGruposCloseDrawer }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { reset, control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

   async function handleSave(data){
      handleLoad(true);

      const result = await salvarGrupoUsuario(user, data);

      if(result){
         await getGruposCloseDrawer();
      }

      handleLoad(false);
   }

   useMemo(() => {
      if(open){
         reset(grupoSelecionado);
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
               getGruposCloseDrawer()
            }}
        >
            {open && (
               <Box sx={{ p: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={3}>
                           <Grid item xs={12}>
                              <Typography variant="h4">{grupoSelecionado ? 'Editar' : 'Adicionar'} Grupo de Usuário</Typography>
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="gru_nome"
                                 control={control}
                                 variant='outlined'
                                 label="Nome:"
                                 error={errors?.gru_nome?.message}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <InputForm
                                 name="gru_descricao"
                                 control={control}
                                 variant='outlined'
                                 label="Descrição:"
                                 error={errors?.gru_descricao?.message}
                                 multiline
                                 rows={5}
                              />
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

AddGrupoUsuario.propTypes = {
    open: PropTypes.bool,
    handleDrawerOpen: PropTypes.func
};

export default AddGrupoUsuario;
