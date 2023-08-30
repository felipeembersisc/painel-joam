import { Controller } from 'react-hook-form';
import { FormControl, Typography } from '@mui/material';
import OtpInput from 'react18-input-otp';

// Hooks
import { useTheme } from '@mui/material/styles';

export function OtpInputForm({control, name, error, required, ...rest}){
   const theme = useTheme();
   const borderColor = theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[300];

   return(
      <>
         <Controller
            control={control}
            rules={{required: required}}
            render={({field: { onChange, onBlur, value }}) => {

               return (
                  <OtpInput
                     value={value}
                     onChange={onChange}
                     onBlur={onBlur}
                     numInputs={4}
                     containerStyle={{ justifyContent: 'space-between' }}
                     inputStyle={{
                        width: '100%',
                        margin: '8px',
                        padding: '10px',
                        border: `1px solid ${borderColor}`,
                        borderRadius: 4,
                        ':hover': {
                              borderColor: theme.palette.secondary.main
                        }
                     }}
                     focusStyle={{
                        outline: 'none',
                        border: `2px solid ${theme.palette.secondary.main}`
                     }}
                     {...rest}
                  />
               )
            }}
            name={name}
         />
         {error && 
            <FormControl fullWidth>
               <Typography color='red' ml={0.5} mb={0.5} fontSize={13}>{error}</Typography>
            </FormControl>
         }
      </>
   )
}