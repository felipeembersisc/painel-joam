// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { useDispatch } from '@/store';
import { useNavigate } from 'react-router-dom';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from '@/ui-component/extended/AnimateButton';
import useAuth from '@/hooks/useAuth';
import useScriptRef from '@/hooks/useScriptRef';
import { useLoad } from '@/hooks/useLoad';
import { openSnackbar } from '@/store/slices/snackbar';

// ========================|| FIREBASE - FORGOT PASSWORD ||======================== //

const AuthForgotPassword = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleLoad } = useLoad();

    const { resetPassword } = useAuth();

    return (
        <Formik
            initialValues={{
                email_usu: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email_usu: Yup.string().email('Digite um e-mail válido').max(255).required('E-mail é um campo obrigatório')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    handleLoad(true)
                    const retornoReset = await resetPassword(values.email_usu);
                    if (retornoReset.retorno) {
                        setStatus({ success: true });
                        setSubmitting(false);
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: retornoReset.mensagem,
                                variant: 'alert',
                                alert: {
                                    color: 'success'
                                },
                                close: false
                            })
                        );
                        setTimeout(() => {
                            navigate('/login', { replace: true });
                        }, 1500);
                    } else {
                        throw new Error(retornoReset.mensagem)
                    }

                } catch (err) {
                    console.error(err);
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                } finally {
                    handleLoad(false)
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl fullWidth error={Boolean(touched.email_usu && errors.email_usu)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel htmlFor="outlined-adornment-email-forgot">E-mail</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email-forgot"
                            type="email_usu"
                            value={values.email_usu}
                            name="email_usu"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Digite seu e-mail"
                            inputProps={{}}
                        />
                        {touched.email_usu && errors.email_usu && (
                            <FormHelperText error id="standard-weight-helper-text-email-forgot">
                                {errors.email_usu}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                Enviar
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default AuthForgotPassword;
