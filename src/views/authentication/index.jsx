import { Link } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthLogin from './auth-forms/AuthLogin';
import Logo from '@/ui-component/Logo';
import BackgroundPattern1 from '@/ui-component/cards/BackgroundPattern1';
import AuthSlider from '@/ui-component/cards/AuthSlider';
import AuthCodeVerification from './auth-forms/AuthCodeVerification';

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

// carousel items
const items = [
    {
        title: 'Components Based Design System',
        description: 'Powerful and easy to use multipurpose theme'
    },
    {
        title: 'Components Based Design System',
        description: 'Powerful and easy to use multipurpose theme'
    },
    {
        title: 'Components Based Design System',
        description: 'Powerful and easy to use multipurpose theme'
    }
];

// Hooks
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
import AuthEmailVerification from './auth-forms/AuthEmailVerification';
import AuthResetPassword from './auth-forms/AuthResetPassword';

// ================================|| AUTH - LOGIN ||================================ //

const Login = () => {
    const { user, isEmailVerification } = useAuth();
    const theme = useTheme();
    const [secret, setSecret] = useState(null);
    const [hashTrocarSenha, setHashTrocarsenha] = useState('');
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <AuthWrapper1>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ minHeight: '100vh' }}>
                <Grid item container justifyContent="center" md={6} lg={7} sx={{ my: 3 }}>
                    <AuthCardWrapper>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    direction={matchDownSM ? 'column-reverse' : 'row'}
                                    alignItems={matchDownSM ? 'center' : 'inherit'}
                                    justifyContent={matchDownSM ? 'center' : 'space-between'}
                                >
                                    <Grid item>
                                        <Stack
                                            justifyContent={matchDownSM ? 'center' : 'flex-start'}
                                            textAlign={matchDownSM ? 'center' : 'inherit'}
                                        >
                                            <Typography
                                                color={theme.palette.secondary.main}
                                                gutterBottom
                                                variant={matchDownSM ? 'h3' : 'h2'}
                                            >
                                                Poupa Sistema
                                            </Typography>
                                            <Typography color="textPrimary" gutterBottom variant="h4">
                                                Logar na sua conta
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item sx={{ mb: { xs: 3, sm: 0 } }}>
                                        <Link to="#">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                {!user ? (
                                    hashTrocarSenha ? (
                                        <AuthResetPassword hashTrocarSenha={hashTrocarSenha} setHashTrocarsenha={setHashTrocarsenha} />
                                    ) : (
                                        <AuthLogin setSecret={setSecret} setHashTrocarsenha={setHashTrocarsenha} />
                                    )
                                ) : user && isEmailVerification ? (
                                    <AuthEmailVerification />
                                ) : (
                                    <AuthCodeVerification secret={secret} />
                                )}
                            </Grid>
                        </Grid>
                    </AuthCardWrapper>
                </Grid>
                <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
                    <BackgroundPattern1>
                        <Grid item container alignItems="flex-end" justifyContent="center" spacing={3}>
                            <Grid item xs={12}>
                                <span />
                                <PurpleWrapper />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid item container justifyContent="center" sx={{ pb: 8 }}>
                                    <Grid item xs={10} lg={8} sx={{ '& .slick-list': { pb: 2 } }}>
                                        <AuthSlider items={items} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </BackgroundPattern1>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
