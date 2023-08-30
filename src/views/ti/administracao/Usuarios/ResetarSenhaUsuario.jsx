import { useEffect, useState } from 'react';

// material-ui
import { Box, Button, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SubCard from '@/ui-component/cards/SubCard';

// Services
import { salvarSenhaPainel, salvarUsuario } from '../../../../services/administracao';

// Components
import { SimpleModal } from '../../../../components/Modal';

// Utils
import { InputForm } from '../../../../components/InputForm';
import { StrongPasswordList } from '../../../../components/StrongPasswordList';
import { strengthColor, strengthIndicatorNumFunc } from '@/utils/password-strength';

// Form
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useForm } from 'react-hook-form';

// Hooks
import { useLoad } from '../../../../hooks/useLoad';
import useAuth from '../../../../hooks/useAuth';

// Schema Validations
const schemaPassword = Yup.object().shape({
   usu_senha: Yup.string().max(255).required('Senha é obrigatória'),
   confirm_usu_senha: Yup.string().when('usu_senha', {
      is: (val) => !!(val && val.length > 0),
      then: Yup.string().oneOf([Yup.ref('usu_senha')], 'A senhas não coincidem!').required('Confirmação de senha obrigatória')
   })
})

const defaultValues = {
   usu_senha: '',
   confirm_usu_senha: ''
};

// ==============================|| ALTERAR SENHA DO USUÁRIO ||============================== //

const ResetarSenhaUsuario = ({ open, setOpen, setUsuarioSelecionado, usuarioSelecionado, getUsuarios }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [showPassword, setShowPassword] = useState(false);
   const [strength, setStrength] = useState(0);
   const [validacaoSenha, setValidacaoSenha] = useState("");
   const [level, setLevel] = useState();

    const {
      watch,
      setValue,
      reset,
      control,
      handleSubmit,
      formState: { errors },
   } = useForm({ resolver: yupResolver(schemaPassword), defaultValues });

   const senha = watch('usu_senha');

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicatorNumFunc(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

   const handleSavePassword = async(data) => {
      if(strength === 5 && validacaoSenha){
         handleLoad(true);

         const result = await salvarSenhaPainel(user, { usu_id: usuarioSelecionado.usu_id, usu_senha: data.usu_senha });

         if(result){
            setOpen(!open);
            reset(defaultValues);
            await getUsuarios();
         }

         handleLoad(false);
      }
   }

   useEffect(() => {
      reset(defaultValues);

      if(!open){
         setUsuarioSelecionado(null);
      }
   },[open])

   return (
      <SimpleModal
         open={open}
         setOpen={setOpen}
         title="Alterar Senha do Usuário"
         actions={
            <Stack flex={1} justifyContent="flex-end" alignItems="flex-end">
               <Button variant="contained" size="medium" color="secondary" onClick={handleSubmit(handleSavePassword)}>
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
            <SubCard title="Preencha os campos para a alteração">
               <Grid container spacing={2}>
                  <Grid item xs={6}>   
                     <InputForm
                        name="usu_senha"
                        control={control}
                        label='Senha'
                        onChange={(e)=> {
                           changePassword(e.target.value)
                           setValue('usu_senha', e.target.value)
                        }}
                        endAdornment={
                           <InputAdornment position="end">
                              <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    size="large"
                              >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                           </InputAdornment>
                        }
                        showPassword={showPassword}
                        error={
                           errors?.usu_senha?.message
                        }
                     />
                     {strength !== 0 && (
                        <FormControl fullWidth>
                           <Box>
                              <Grid container spacing={2} alignItems="center">
                                 <Grid item>
                                    <Box
                                       style={{ backgroundColor: level?.color }}
                                       sx={{
                                          width: 85,
                                          height: 8,
                                          borderRadius: '7px'
                                       }}
                                    />
                                 </Grid>
                                 <Grid item>
                                    <Typography variant="subtitle1" fontSize="0.75rem">
                                       {level?.label}
                                    </Typography>
                                 </Grid>
                              </Grid>
                           </Box>
                        </FormControl>
                     )}
                  </Grid>

                  <Grid item xs={6}>
                     <InputForm
                        name="confirm_usu_senha"
                        control={control}
                        label='Confirmar senha'
                        error={
                           errors?.confirm_usu_senha?.message
                        }
                     />
                  </Grid>

                  {
                     senha &&
                     <Grid item xs={12}>
                        <Box>
                           <StrongPasswordList
                              senha={senha}
                              onChange={(e)=> setValidacaoSenha(e)}
                           />
                        </Box>
                     </Grid>
                  }



               </Grid>
            </SubCard>
         </Grid>
      </SimpleModal>
   );
};

export default ResetarSenhaUsuario;
