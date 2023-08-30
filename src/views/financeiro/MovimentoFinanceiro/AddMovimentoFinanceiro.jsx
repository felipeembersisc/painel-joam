import { useEffect, useState } from 'react';

// material-ui
import {
    Button,
    Grid,
    Stack,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

// project imports
import SubCard from '@/ui-component/cards/SubCard';

// Services
import { salvarMovimentoFinanceiro } from '../../../services/financeiro';

// Form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';

// Components
import { InputForm } from '../../../components/InputForm';
import { SelectForm } from '../../../components/SelectForm';
import { SimpleModal } from '../../../components/Modal';
import { DateInputForm } from '../../../components/DateInputForm';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';

// Utils
import funcoes from '../../../utils/funcoes';
import moment from 'moment';

const schema = yup.object({
   mov_data: yup.string().required('Campo obrigatório'),
   mov_categoria: yup.mixed().required('Campo obrigatório'),
   mov_categoria_descricao: yup.mixed().required('Campo obrigatório'),
   mov_conta_id: yup.number().required('Campo obrigatório'),
   mov_escritorio_id: yup.number().required('Campo obrigatório'),
   mov_fornecedor_id: yup.number().required('Campo obrigatório'),
   mov_valor: yup.string().required('Campo obrigatório'),
   mov_descricao: yup.string().required('Campo obrigatório'),
   mov_empresa_id: yup.number().required('Campo obrigatório'),
   mov_tipo_id: yup.number().required('Campo obrigatório')
});

const defaultValues = {
   mov_data: moment().format(),
   mov_categoria: '',
   mov_categoria_descricao: '',
   mov_conta_id: null,
   mov_escritorio_id: null,
   mov_fornecedor_id: null,
   mov_valor: '',
   mov_descricao: '',
   mov_empresa_id: null,
   mov_tipo_id: null,
};

// ==============================|| ADD/EDIT MOVIMENTO FINANCEIRO ||============================== //

const AddMovimentoFinanceiro = ({ open, movimentoSelecionado, empresaSelecionada, tipoSelecionado, contasBancarias, fornecedores, categorias, escritorios, handleCloseModal }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { reset, control, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: yupResolver(schema), defaultValues: defaultValues });

   const [novaCategoria, setNovaCategoria] = useState(false);

   async function handleSave(data){
      handleLoad(true);

      const result = await salvarMovimentoFinanceiro(user, data);

      if(result){
         await handleCloseModal();
         setNovaCategoria(false);
      }

      handleLoad(false);
   }

   function handleNewCategoria(type){
      switch (type) {
         case 'novo':
            setNovaCategoria(true);
            setValue('mov_categoria', null);
            setValue('mov_categoria_descricao', '');
         break;
         case 'selecionar':
            setNovaCategoria(false);
            setValue('mov_categoria', null);
            setValue('mov_categoria_descricao', '');
         break;
         default:
         break;
      }
   }

   function handleChangeCategoria(data){
      if(data){
         setValue('mov_categoria', data.id);
         setValue('mov_categoria_descricao', data.ctm_descricao);
      }else{
         setValue('mov_categoria', null);
         setValue('mov_categoria_descricao', '');
      }
   }

   useEffect(() => {
      reset(defaultValues);

      if(open && !movimentoSelecionado){
         reset({ mov_empresa_id: empresaSelecionada.id, mov_tipo_id: tipoSelecionado });
      }

      if(open && movimentoSelecionado){
         reset(movimentoSelecionado);

         if(movimentoSelecionado.mov_categoria_id){
            const auxCategoria = categorias.find(cat => cat.id === movimentoSelecionado.mov_categoria_id);
            handleChangeCategoria(auxCategoria);
         }

         if(movimentoSelecionado.mov_valor){
            setValue('mov_valor', funcoes.formatarMoeda(movimentoSelecionado.mov_valor));
         }
      }
   }, [open])

   return (
      <SimpleModal
         open={open}
         setOpen={handleCloseModal}
         title="Movimentação Financeira"
         actions={
            <Stack flex={1} justifyContent="flex-end" alignItems="flex-end">
               <Button variant="contained" size="medium" color="secondary" onClick={handleSubmit(handleSave)}>
                  Salvar
               </Button>
            </Stack>
         }
         style= {{
            width: { xs: 280, lg: 1124 },
            maxHeight: '90vh',
            overflowY: 'auto',
         }}
      >
         <Grid item xs={12} marginBottom={2}>
            <SubCard title={`Dados da ${tipoSelecionado == 1 ? 'Receita' : 'Despesa'}`}>
               <Grid container spacing={2}>
                  <Grid item xs={6}>
                     <DateInputForm
                        name="mov_data"
                        control={control}
                        label="Efetuado Em:"
                        error={ errors?.mov_data?.message }
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <SelectForm
                        name="mov_conta_id"
                        control={control}
                        label="Conta Bancária:"
                        options={contasBancarias ?? []}
                        error={ errors?.mov_conta_id?.message }
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <SelectForm
                        name="mov_escritorio_id"
                        control={control}
                        label="Escritório:"
                        options={escritorios ?? []}
                        error={ errors?.mov_escritorio_id?.message }
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <SelectForm
                        name="mov_fornecedor_id"
                        control={control}
                        label="Fornecedor:"
                        options={fornecedores ?? []}
                        error={ errors?.mov_fornecedor_id?.message }
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <InputForm
                        name="mov_valor"
                        control={control}
                        variant='outlined'
                        type='money'
                        label="Valor:"
                        error={errors?.mov_valor?.message}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <InputForm
                        name="mov_descricao"
                        control={control}
                        variant='outlined'
                        label="Descrição:"
                        multiline
                        rows={4}
                        error={errors?.mov_descricao?.message}
                     />
                  </Grid>
               </Grid>
            </SubCard>
            <SubCard 
               title= {(
                  <Stack flex={1} flexDirection="row" justifyContent="space-between" alignItems="center">
                     <Typography variant='h5'>
                        Selecionar Categoria
                     </Typography>
                     {
                        !novaCategoria ? 
                           <Button variant="contained" size="small" color="success" onClick={()=> handleNewCategoria('novo')} startIcon={<AddIcon />}>
                              Nova Categoria
                           </Button>
                        :
                           <Button variant="contained" size="small" color="error" onClick={()=> handleNewCategoria('selecionar')} startIcon={<KeyboardArrowLeftIcon />}>
                              Selecionar Existente
                           </Button>
                     }
                  </Stack>
               )}
            >
               <Grid container spacing={2}>
                  <Grid item xs={6}>
                     {
                        novaCategoria ?
                           <InputForm
                              name="mov_categoria"
                              control={control}
                              variant='outlined'
                              label="Informe a Categoria:"
                              error={errors?.mov_categoria?.message}
                           />
                        :
                           <SelectForm
                              name="mov_categoria"
                              control={control}
                              label="Selecione a Categoria:"
                              onChange={(e, value) => handleChangeCategoria(value)}
                              options={categorias ?? []}
                              error={ errors?.mov_categoria?.message }
                           />
                     }
                  </Grid>
                  <Grid item xs={6}>
                     <InputForm
                        name="mov_categoria_descricao"
                        control={control}
                        variant='outlined'
                        label="Descrição da Categoria:"
                        multiline
                        rows={4}
                        disabled={!novaCategoria && true}
                        error={errors?.mov_categoria_descricao?.message}
                     />
                  </Grid>
               </Grid>
            </SubCard>
         </Grid>
      </SimpleModal>
   );
};

export default AddMovimentoFinanceiro;
