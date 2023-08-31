import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// material-ui
import {
   Box,
   Button,
   IconButton,
   InputAdornment,
   Stack,
   Typography
} from '@mui/material';

// Hooks
import { useLoad } from '../../../hooks/useLoad';

// Form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';

// project imports
import useAuth from '@/hooks/useAuth';
import AnimateButton from '@/ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import { InputForm } from '../../../components/InputForm';

const schemaLogin = Yup.object().shape({
   login_usu: Yup.string().max(255).required('Usuário é obrigatório'),
   senha_usu: Yup.string().max(255).required('Senha é obrigatória')
})

// ============================|| LOGIN ||============================ //

const AuthLogin = ({ setSecret, setHashTrocarsenha }) => {
   const { hashUser } = useParams();
   const { handleLoad } = useLoad();
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);

   const { autenticar } = useAuth();

   const {
      control,
      handleSubmit,
      getValues,
      formState: { errors },
   } = useForm({ resolver: yupResolver(schemaLogin) });

   const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const handleLogin = async (data) => {
      handleLoad(true);
      await autenticar(data.login_usu, data.senha_usu);
      handleLoad(false);
   }

   // useEffect(() => {
   //    if (hashUser) {
   //       async function buscarHash() {
   //          handleLoad(true);
   //          navigate('/login');
   //          handleLoad(false);
   //       }

   //       buscarHash();
   //    }
   // }, [hashUser])

   return (
      <>
         <InputForm
            name="login_usu"
            control={control}
            label='Login'
            error={
               errors?.login_usu?.message
            }
         />

         <InputForm
            name="senha_usu"
            control={control}
            label='Senha'
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
            error={errors?.senha_usu?.message}
         />

         <Stack direction="row" alignItems="center" justifyContent="right" spacing={1}>
            <Typography
               variant="subtitle1"
               component={Link}
               to={'/forgot'}
               color="secondary"
               sx={{ textDecoration: 'none' }}
            >
               Esqueci minha senha?
            </Typography>
         </Stack>

         <Box sx={{ mt: 2 }}>
            <AnimateButton>
               <Button
                  disableElevation
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit(handleLogin)}
               >
                  Entrar
               </Button>
            </AnimateButton>
         </Box>
      </>
   );
};

export default AuthLogin;