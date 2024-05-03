import { Link } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Stack, Typography, useMediaQuery, Divider } from '@mui/material';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthLogin from './auth-forms/AuthLogin';
import Logo from '@/ui-component/Logo';

// assets
import AuthBlueCard from '@/assets/images/auth/auth-blue-card.svg';
import AuthPurpleCard from '@/assets/images/auth/auth-purple-card.svg';

// styles
const PurpleWrapper = styled('span')({
   '&:after': {
      content: '""',
      position: 'absolute',
      top: '32%',
      left: '40%',
      width: 313,
      backgroundSize: 380,
      height: 280,
      backgroundImage: `url(${AuthPurpleCard})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      animation: '15s wings ease-in-out infinite'
   },
   '&:before': {
      content: '""',
      position: 'absolute',
      top: '23%',
      left: '37%',
      width: 243,
      height: 210,
      backgroundSize: 380,
      backgroundImage: `url(${AuthBlueCard})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      animation: '15s wings ease-in-out infinite',
      animationDelay: '1s'
   }
});

// Hooks
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';

// ================================|| AUTH - LOGIN ||================================ //

const Login = () => {
   const theme = useTheme();
   const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

   return (
      <AuthWrapper1>
         <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
            <Grid item xs={12}>
               <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                  <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                     <AuthCardWrapper>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                           <Grid item sx={{ mb: 3 }}>
                              <Link to="#">
                                 <Logo />
                              </Link>
                           </Grid>
                           <Grid item xs={12}>
                              <Grid
                                 container
                                 direction={matchDownSM ? 'column-reverse' : 'row'}
                                 alignItems="center"
                                 justifyContent="center"
                              >
                                 <Grid item>
                                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                                       <Typography
                                          color={theme.palette.secondary.main}
                                          gutterBottom
                                          variant={matchDownSM ? 'h3' : 'h2'}
                                       >
                                          Bem-vindo(a) ao CRM
                                       </Typography>
                                       <Typography
                                          variant="caption"
                                          fontSize="16px"
                                          textAlign={matchDownSM ? 'center' : 'inherit'}
                                       >
                                          Informe o login e a senha para acessar o sistema
                                       </Typography>
                                    </Stack>
                                 </Grid>
                              </Grid>
                           </Grid>
                           <Grid item xs={12}>
                              <AuthLogin />
                           </Grid>
                        </Grid>
                     </AuthCardWrapper>
                  </Grid>
               </Grid>
            </Grid>
         </Grid>
      </AuthWrapper1>
   );
};

export default Login;
