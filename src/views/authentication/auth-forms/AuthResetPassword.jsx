import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    Typography
} from '@mui/material';

// project imports
import AnimateButton from '@/ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicatorNumFunc } from '@/utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { InputForm } from '../../../components/InputForm';

// Forms
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import { StrongPasswordList } from '../../../components/StrongPasswordList';

// Hooks
import useAuth from '../../../hooks/useAuth';

// Schema Validations
const schemaPassword = Yup.object().shape({
   usu_senha: Yup.string().max(255).required('Senha é obrigatória'),
   confirm_usu_senha: Yup.string().when('usu_senha', {
      is: (val) => !!(val && val.length > 0),
      then: Yup.string().oneOf([Yup.ref('usu_senha')], 'A senhas não coincidem!').required('Confirmação de senha obrigatória')
   })
})

// ========================|| RESET PASSWORD ||======================== //

const AuthResetPassword = ({ hashTrocarSenha, setHashTrocarsenha }) => {
    const { savePassword } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [validacaoSenha, setValidacaoSenha] = useState("");
    const [level, setLevel] = useState();

    const {
      watch,
      setValue,
      control,
      handleSubmit,
      formState: { errors },
   } = useForm({ resolver: yupResolver(schemaPassword) });

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
         const result = await savePassword(data.usu_senha, hashTrocarSenha);
         if(result){
            setHashTrocarsenha(null);
            navigate('/login');
         }
      }
   }

    return (
      <>
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
                  <Box sx={{ mb: 2 }}>
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

         <InputForm
            name="confirm_usu_senha"
            control={control}
            label='Confirmar senha'
            error={
               errors?.confirm_usu_senha?.message
            }
         />

         <Box sx={{ mt: 1 }} >
            <AnimateButton>
                  <Button
                     disableElevation
                     fullWidth
                     size="large"
                     type="submit"
                     variant="contained"
                     color="secondary"
                     onClick={handleSubmit(handleSavePassword)}
                  >
                     Resetar Senha
                  </Button>
            </AnimateButton>
         </Box>

         {
            senha &&
            <Box mt={3}>
               <StrongPasswordList 
                  senha={senha}
                  onChange={(e)=> setValidacaoSenha(e)}
               />
            </Box>
         }
      </>
    );
};

export default AuthResetPassword;
