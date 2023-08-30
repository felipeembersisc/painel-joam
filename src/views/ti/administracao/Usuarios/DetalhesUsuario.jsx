// material-ui
import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import SubCard from '@/ui-component/cards/SubCard';

// Components
import { SimpleModal } from '../../../../components/Modal';

// Utils
import { InputForm } from '../../../../components/InputForm';
import { useEffect } from 'react';

// Form
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from 'react-hook-form';

// Hooks
import { useLoad } from '../../../../hooks/useLoad';
import useAuth from '../../../../hooks/useAuth';
import { SelectForm } from '../../../../components/SelectForm';
import { salvarUsuario } from '../../../../services/administracao';

const schema = yup.object({
   usu_login: yup.string().required('Login Obrigatório'),
   usu_nome: yup.string().required('Nome Obrigatório'),
   usu_funcionario_id: yup.number().required('Funcionário Obrigatório'),
   usu_grupo_id: yup.number().required('Grupo Obrigatório'),
   usu_is_ativo: yup.boolean().required('Status Obrigatório')
});

const defaultValues = {
   usu_login: '',
   usu_nome: '',
   usu_funcionario_id: null,
   usu_grupo_id: null,
   usu_is_ativo: true
};

const status = [ 
   { label: 'Ativo', id: true }, 
   { label: 'Inativo', id: false }, 
]


// ==============================|| DETALHES DO USUÁRIO ||============================== //

const DetalhesUsuario = ({ open, setOpen, setUsuarioSelecionado, usuarioSelecionado, funcionarios, gruposUsuarios, getUsuarios }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { reset, control, setValue, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema), defaultValues });

   const statusSelecionado = watch('usu_is_ativo');
   const funcionarioId = watch('usu_funcionario_id');

   const emailFuncionario = funcionarios.find(fun => fun.id === funcionarioId)?.fun_email;

   async function handleSave(data){
      handleLoad(true);

      const result = await salvarUsuario(user, data);

      if(result){
         setOpen(!open);
         reset(defaultValues);
         await getUsuarios();
      }

      handleLoad(false);
   }

   useEffect(() => {
      reset(defaultValues);

      async function initComponent() {
         if(usuarioSelecionado){
            reset(usuarioSelecionado);
         }
      }

      if(open){
         initComponent();
      }else{
         setUsuarioSelecionado(null);
      }
   },[open])

   return (
      <SimpleModal
         open={open}
         setOpen={setOpen}
         title="Detalhes do Usuário"
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
            <SubCard title="Detalhes">
               <Grid container spacing={2}>
                  <Grid item xs={6}>
                     <InputForm
                        name="usu_login"
                        control={control}
                        variant='outlined'
                        label="Login:"
                        error={errors?.usu_login?.message}
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <InputForm
                        name="usu_nome"
                        control={control}
                        variant='outlined'
                        label="Nome:"
                        error={errors?.usu_nome?.message}
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <SelectForm
                        name="usu_funcionario_id"
                        control={control}
                        label="Funcionário:"
                        options={funcionarios ?? []}
                        error={ errors?.usu_funcionario_id?.message }
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        variant='outlined'
                        label="Email:"
                        value={emailFuncionario}
                        disabled
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <SelectForm
                        name="usu_grupo_id"
                        control={control}
                        label="Grupo de Usuário:"
                        options={gruposUsuarios ?? []}
                        error={ errors?.usu_grupo_id?.message }
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <Grid container alignItems="center" mt={2} ml={1}>
                        <Grid item mr={2}>
                           <Typography variant="subtitle1">Status:</Typography>
                        </Grid>
                        <Grid item >
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
                                    status.map((sta) => (
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
               </Grid>
            </SubCard>
         </Grid>
      </SimpleModal>
   );
};

export default DetalhesUsuario;
