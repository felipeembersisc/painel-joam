// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// Components
import QRCode from 'react-qr-code';
import AnimateButton from '@/ui-component/extended/AnimateButton';
import { IconArrowBadgeLeft } from '@tabler/icons';
import { InputForm } from '../../../components/InputForm';

// Hooks
import useAuth from '../../../hooks/useAuth';

// Form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schemaCodeVerification = Yup.object().shape({
    cod_google: Yup.number().required('Codigo obrigatório')
});

// ============================|| STATIC - CODE VERIFICATION ||============================ //

const AuthCodeVerification = ({ secret }) => {
    const { user, validarDuploFator, saveDoubleFactor, emailVerificationDoubleFactor, logout } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schemaCodeVerification) });

    async function saveSecretDoubleFactor() {
        await saveDoubleFactor(user, String(secret));
    }

    async function sendEmailResetDoubleFactor() {
        await emailVerificationDoubleFactor(user);
    }

    async function handleCodeVerification(data) {
        await validarDuploFator(user, data.cod_google);
    }

    return (
        <Grid container spacing={3}>
            <Grid item my={3}>
                {user.usu_duplo_fator ? (
                    <>
                        <Typography textAlign="center" mx={2} fontSize={16} mb>
                            Acesse o aplicativo <strong>"Google Authenticator"</strong> e digite abaixo o código de 6 números.
                        </Typography>
                        <InputForm
                            name="cod_google"
                            control={control}
                            label="Código do aplicativo"
                            type="number"
                            error={errors?.cod_google?.message}
                        />
                        <Grid item xs={12}>
                            <Box sx={{ mt: 4 }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleSubmit(handleCodeVerification)}
                                    >
                                        Entrar
                                    </Button>
                                </AnimateButton>
                            </Box>

                            <Stack direction="row" justifyContent="space-between" alignItems="baseline" mt={2}>
                                <Typography fontSize={15}>Precisa resetar o duplo fator ?</Typography>
                                <Typography
                                    fontSize={15}
                                    variant="button"
                                    onClick={sendEmailResetDoubleFactor}
                                    sx={{ ml: 2, textDecoration: 'none', cursor: 'pointer' }}
                                    color="primary"
                                >
                                    Resetar
                                </Typography>
                            </Stack>

                            <Stack mt direction="row" alignItems="center">
                                <IconArrowBadgeLeft fontSize={50} />
                                <Typography
                                    fontSize={15}
                                    variant="button"
                                    onClick={logout}
                                    sx={{ textDecoration: 'none', cursor: 'pointer' }}
                                    color="primary"
                                >
                                    Voltar ao login
                                </Typography>
                            </Stack>
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={12} align="center">
                        <Typography textAlign="center" mx={2} fontSize={16} mb={2}>
                            Acesse o aplicativo <strong>"Google Authenticator"</strong> e escaneie o QRCode
                        </Typography>
                        <QRCode value={String(secret)} size={200} title="Poupa Sistema" />
                        <Typography textAlign="center" mx={2} fontSize={16} my={4}>
                            Após escanear, clique em <strong>"Próximo"</strong>
                        </Typography>
                        <Box sx={{ mt: 4 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={saveSecretDoubleFactor}
                                >
                                    Próximo
                                </Button>
                            </AnimateButton>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};
export default AuthCodeVerification;
