import { useEffect } from 'react';

// material-ui
import {
    Box,
    Button,
    Drawer,
    Grid,
    Typography,
} from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// project imports
import AnimateButton from '@/ui-component/extended/AnimateButton';

// Services
import { salvarCategoriaMovimento } from '../../../services/financeiro';

// Form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { InputForm } from '../../../components/InputForm';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';

const schema = yup.object({
   ctm_nome: yup.string().required('Nome obrigatório'),
   ctm_descricao: yup.string()
});

const defaultValues = {
   ctm_nome: '',
   ctm_descricao: ''
};

// ==============================|| ADD/EDIT CATEGORIA MOVIMENTO ||============================== //

const AddCategoria = ({ open, categoriaSelecionada, handleCloseDrawer }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { reset, control, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

   async function handleSave(data){
      handleLoad(true);

      const result = await salvarCategoriaMovimento(user, data);

      if(result){
         await handleCloseDrawer();
      }

      handleLoad(false);
   }

   useEffect(() => {
      if(open){
         reset(categoriaSelecionada);
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
                              <Typography variant="h4">{categoriaSelecionada ? 'Editar' : 'Adicionar'} Categoria</Typography>
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

export default AddCategoria;
