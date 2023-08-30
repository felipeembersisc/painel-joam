import { useEffect, useState } from 'react';

// material-ui
import { Button, Grid, Stack, Typography } from '@mui/material';

// Hooks
import useAuth from '../../../hooks/useAuth';

// Form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// third-party
import { IconArrowBadgeLeft } from '@tabler/icons';
import { toast } from 'react-toastify';
import { OtpInputForm } from '../../../components/OtpInputForm';

const schemaEmailVerification = Yup.object().shape({
   cod_email: Yup.number().required('Codigo obrigatório')
});

// ============================|| STATIC - EMAIL VERIFICATION ||============================ //

const AuthEmailVerification = () => {
   const { user, logout, emailVerificationDoubleFactor, resetDoubleFactor } = useAuth();

   const [countAttemps, setCountAttemps] = useState(0);

   const {
      control,
      handleSubmit,
      formState: { errors }
   } = useForm({ resolver: yupResolver(schemaEmailVerification) });

   async function handleReset(data){
      await resetDoubleFactor(user, data.cod_email)
      setCountAttemps(countAttemps + 1)
   }

   useEffect(() => {
      if(countAttemps === 3){
         logout();
         toast.info('Excesso de tentativas 🤨');
      }
   },[countAttemps])

   return (
      <Grid container spacing={3}>
         <Grid item xs={12}>
            <Typography textAlign='center' mx={2} fontSize={16} mb>
               Insira abaixo o{" "}
               <strong>Código</strong> recebido em seu email.
            </Typography>
            <OtpInputForm 
               name="cod_email"
               control={control}
               error={errors?.cod_email?.message}
            />
         </Grid>
         <Grid item xs={12}>
            <Button 
               disableElevation 
               fullWidth 
               size="large" 
               variant="contained" 
               color="secondary" 
               onClick={handleSubmit(handleReset)}
            >
               Continue
            </Button>
         </Grid>
         <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
               <Typography>Não recebeu o email ?</Typography>
               <Typography variant="button" onClick={()=> emailVerificationDoubleFactor(user)} sx={{ ml: 2, textDecoration: 'none', cursor: 'pointer' }} color="primary">
                  Reenviar
               </Typography>
            </Stack>
            <Stack mt direction="row" alignItems="center">
               <IconArrowBadgeLeft fontSize={50}/>
               <Typography fontSize={15} variant="button" onClick={logout} sx={{ textDecoration: 'none', cursor: 'pointer' }} color="primary">
                  Voltar ao login
               </Typography>
            </Stack>
         </Grid>
      </Grid>
   );
};
export default AuthEmailVerification;
