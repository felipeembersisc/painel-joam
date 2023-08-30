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

// Form
import { useForm } from 'react-hook-form';
import { SelectForm } from '../../../components/SelectForm';
import { DateInputForm } from '../../../components/DateInputForm';

const options = [
   { id: 1, label: 'RECEITA' },
   { id: 1, label: 'DESPESA' },
]

// ==============================|| FILTRO DE MOVIMENTO FINANCEIRO ||============================== //

const FiltroMovimentoFinanceiro = ({ open, handleDrawerOpen, empresaSelecionada, contasBancarias, escritorios, fornecedores, categorias, filtro, handleFiltro }) => {
   const { reset, control, handleSubmit } = useForm();

   useEffect(() => {
      if(filtro){
         reset({...filtro, con_empresa_id: empresaSelecionada?.id });
      }else{
         reset({ con_empresa_id: empresaSelecionada?.id });
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
                              <Typography variant="h4">Filtrar Movimento Financeiro</Typography>
                           </Grid>
                           <Grid item xs={6}>
                              <DateInputForm
                                 name="mov_data_inicio"
                                 control={control}
                                 label="Lançamentos apartir de:"
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <DateInputForm
                                 name="mov_data_fim"
                                 control={control}
                                 label="Lançamentos até:"
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <SelectForm
                                 name="mov_conta_id"
                                 control={control}
                                 label="Conta Bancária:"
                                 options={contasBancarias ?? []}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <SelectForm
                                 name="mov_escritorio_id"
                                 control={control}
                                 label="Escritório:"
                                 options={escritorios ?? []}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <SelectForm
                                 name="mov_fornecedor_id"
                                 control={control}
                                 label="Fornecedor:"
                                 options={fornecedores ?? []}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <SelectForm
                                 name="mov_categoria_id"
                                 control={control}
                                 label="Categoria:"
                                 options={categorias ?? []}
                              />
                           </Grid>
                           <Grid item xs={12}>
                              <SelectForm
                                 name="mov_tipo_id"
                                 control={control}
                                 label="Tipo de Lançamento:"
                                 options={options ?? []}
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

export default FiltroMovimentoFinanceiro;
