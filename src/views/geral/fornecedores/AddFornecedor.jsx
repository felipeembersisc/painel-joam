import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Button,
    Grid,
    Typography,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
} from '@mui/material';

// project imports
import SubCard from '@/ui-component/cards/SubCard';

// Form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { salvarFornecedor } from '../../../services/inventario';

// Components
import { SelectForm } from '../../../components/SelectForm';
import { InputForm } from '../../../components/InputForm';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';
import { SimpleModal } from '../../../components/Modal';
import { getCeps, getCidades, getEstados } from '../../../services/geral';
import { toast } from 'react-toastify';

const schema = yup.object({
   for_nome: yup.string().nullable().required('Campo obrigatório'),
   for_tipo_pessoa: yup.string().nullable().required('Campo obrigatório'),
   for_razao_social: yup.string().nullable(),
   for_cpfcnpj: yup.string().nullable().required('Campo obrigatório'),
   for_insc_est: yup.string().nullable(),
   for_insc_mun: yup.string().nullable(),
   for_end_cep: yup.string().nullable().required('Campo obrigatório'),
   for_end_rua: yup.string().nullable().required('Campo obrigatório'),
   for_end_bairro: yup.string().nullable().required('Campo obrigatório'),
   for_end_numero: yup.string().nullable().required('Campo obrigatório'),
   for_end_complemento: yup.string().nullable(),
   for_end_uf_id: yup.number().nullable().required('Campo obrigatório'),
   for_end_cidade_id: yup.number().nullable().required('Campo obrigatório'),
   for_celular: yup.string().nullable(),
   for_email: yup.string().nullable(),
   for_ativo: yup.boolean().nullable().required('Campo Obrigatório')
});

const defaultValues = {
   for_nome: '',
   for_tipo_pessoa: null,
   for_razao_social: '',
   for_cpfcnpj: '',
   for_insc_est: '',
   for_insc_mun: '',
   for_end_cep: '',
   for_end_rua: '',
   for_end_bairro: '',
   for_end_numero: '',
   for_end_complemento: '',
   for_end_uf_id: null,
   for_end_cidade_id: null,
   for_celular: '',
   for_email: '',
   for_ativo: true
};

const status = [
   { id: true, label: 'Ativo' },
   { id: false, label: 'Desativado' },
]

const tiposPessoa = [
   { id: 'F', label: 'Fisica' },
   { id: 'J', label: 'Juridica' },
]

// ==============================|| ADD FORNECEDOR ||============================== //

const AddFornecedor = ({ open, fornecedorSelecionado, getFornecedoresCloseDrawer }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { reset, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

   const [estados, setEstados] = useState([]);
   const [cidades, setCidades] = useState([]);

   const statusSelecionado = watch('for_ativo');
   const tipoPessoa = watch('for_tipo_pessoa');

   async function handleSave(data){
      handleLoad(true);

      const result = await salvarFornecedor(user, data);

      if(result){
         await getFornecedoresCloseDrawer();
      }

      handleLoad(false);
   }

   async function buscarEstados(){
      const result = await getEstados(user);
      setEstados(result);
   }

   async function buscarCidades(estado){
      const result = await getCidades(user, estado);
      setCidades(result);
      return result;
   }

   function handleChangeTipoPessoa(data){
      setValue('for_razao_social', "");
      setValue('for_cpfcnpj', "");
      setValue('for_insc_est', "");
      setValue('for_insc_mun', "");
      setValue('for_tipo_pessoa', data.id);
   }

   async function handleChangeEstado(data){
      handleLoad(true);
      await buscarCidades(data.id);
      setValue('for_end_uf_id', data.id);
      handleLoad(false);
   }

   async function handleBlurCep(data){
      setValue('for_end_cep', data);

      handleLoad(true);
      const result = await getCeps(data);
      
      if(result){
         setValue('for_end_rua', result.logradouro);
         setValue('for_end_bairro', result.bairro);
         setValue('for_end_complemento', result.complemento);

         const estadoId = estados.find(est => est.label.toLowerCase() == result.uf.toLowerCase()).id;
         setValue('for_end_uf_id', estadoId);
         
         if(estadoId){
            const cidades = await buscarCidades(estadoId);
            const cidadeId = cidades.find(cid => cid.label.toLowerCase() == result.localidade.toLowerCase()).id;
            setValue('for_end_cidade_id', cidadeId);
         }
      }else{
         toast.info('Nenhum CEP encontrado, preencha manualmente 😅');
      }
      handleLoad(false);
   }

   useEffect(() => {
      async function initComponent(){
         await buscarEstados();

         if(fornecedorSelecionado){
            if(fornecedorSelecionado?.for_end_uf_id){
               await buscarCidades(fornecedorSelecionado.for_end_uf_id);
            }
            reset(fornecedorSelecionado);
         }else{
            reset(defaultValues);
         }
      }

      if(open){
         initComponent();
      }else{
         reset(defaultValues);
      }
   }, [open])

    return (
      <SimpleModal
         open={open}
         setOpen={getFornecedoresCloseDrawer}
         title="Detalhes do Fornecedor"
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
            <SubCard title="Geral">
               <Grid container spacing={2}>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_nome"
                        control={control}
                        variant='outlined'
                        label="Nome:"
                        error={errors?.for_nome?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <SelectForm
                        name="for_tipo_pessoa"
                        control={control}
                        label="Tipo Pessoa:"
                        onChange={(e, value)=> handleChangeTipoPessoa(value)}
                        options={tiposPessoa ?? []}
                        error={ errors?.for_tipo_pessoa?.message }
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_cpfcnpj"
                        type="cpfCnpj"
                        control={control}
                        variant='outlined'
                        label="CPF/CNPJ:"
                        inputProps={{
                           maxLength: tipoPessoa == 'F' ? 14 : 18
                        }}
                        disabled={!tipoPessoa && true}
                        error={errors?.for_cpfcnpj?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_razao_social"
                        control={control}
                        variant='outlined'
                        label="Razão Social:"
                        disabled={tipoPessoa !== 'J' && true}
                        error={errors?.for_razao_social?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_insc_est"
                        control={control}
                        variant='outlined'
                        label="Insc. Estadual:"
                        disabled={tipoPessoa !== 'J' && true}
                        error={errors?.for_insc_est?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_insc_mun"
                        control={control}
                        variant='outlined'
                        label="Insc. Municipal:"
                        disabled={tipoPessoa !== 'J' && true}
                        error={errors?.for_insc_mun?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_celular"
                        control={control}
                        variant='outlined'
                        type="phone"
                        label="Celular:"
                        inputProps={{
                           maxLength: 15
                        }}
                        error={errors?.for_celular?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_email"
                        control={control}
                        variant='outlined'
                        label="Email:"
                        error={errors?.for_email?.message}
                     />
                  </Grid>

                  {
                     fornecedorSelecionado &&
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
                                       onChange={(e)=> setValue('for_ativo', e.target.value)}
                                       name="for_ativo"
                                       id="for_ativo"
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
               </Grid>
            </SubCard>
            <SubCard title="Endereço" sx={{ marginTop: '20px' }}>
               <Grid container spacing={2}>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_end_cep"
                        control={control}
                        variant='outlined'
                        label="CEP:"
                        type="cep"
                        inputProps={{
                           maxLength: 9
                        }}
                        onBlur={(e) => handleBlurCep(e.target.value)}
                        error={errors?.for_end_cep?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_end_rua"
                        control={control}
                        variant='outlined'
                        label="Rua:"
                        error={errors?.for_end_rua?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_end_bairro"
                        control={control}
                        variant='outlined'
                        label="Bairro:"
                        error={errors?.for_end_bairro?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_end_numero"
                        control={control}
                        variant='outlined'
                        label="Numero:"
                        error={errors?.for_end_numero?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="for_end_complemento"
                        control={control}
                        variant='outlined'
                        label="Complemento:"
                        error={errors?.for_end_complemento?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <SelectForm
                        name="for_end_uf_id"
                        control={control}
                        label="UF:"
                        options={estados ?? []}
                        onChange={(e, value)=> handleChangeEstado(value)}
                        error={ errors?.for_end_uf_id?.message }
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <SelectForm
                        name="for_end_cidade_id"
                        control={control}
                        label="Cidade:"
                        options={cidades ?? []}
                        error={ errors?.for_end_cidade_id?.message }
                     />
                  </Grid>
               </Grid>
            </SubCard>
         </Grid>
      </SimpleModal>
    );
};

AddFornecedor.propTypes = {
    open: PropTypes.bool,
    handleDrawerOpen: PropTypes.func
};

export default AddFornecedor;
