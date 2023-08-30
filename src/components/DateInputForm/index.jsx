import 'dayjs/locale/pt-br';
import { Controller } from 'react-hook-form';
import { FormControl, TextField, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider, ptBR } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export function DateInputForm({control, name, label, error, required, ...rest}){
   return(
      <>
         <Controller
            control={control}
            rules={{required: required}}
            render={({field: { onChange, onBlur, value }}) => (
               <LocalizationProvider 
                  dateAdapter={AdapterDayjs} 
                  adapterLocale='pt-br'
                  localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
               >
                  <DesktopDatePicker
                     label={label}
                     inputFormat="DD/MM/YYYY"
                     value={value ?? null}
                     onChange={onChange}
                     onBlur={onBlur}
                     renderInput={(params) => <TextField {...params} fullWidth />}
                     {...rest}
                  />
               </LocalizationProvider>
            )}
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