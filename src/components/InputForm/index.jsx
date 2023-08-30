import { Controller } from 'react-hook-form';
import { FormControl, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';

// Hooks
import { useTheme } from '@mui/material/styles';

// Utils
import format from '../../utils/format';

export function InputForm({ name, label, error, required, showPassword, variant, ...rest }){
   const theme = useTheme();

   let type = 'text';

   switch(showPassword){
      case 'undefined':
         type = 'text';
      break;
      case true:
         type = 'text';
      break;
      case false:
         type = 'password';
      break
   }

   return rest.control ? (
      <>
         <Controller
            control={rest.control}
            rules={{required: required}}
            render={({field: { onChange, onBlur, value }}) => {

               function formatarValor(value){
                  if(value){
                     switch(rest.type){

                        case 'cep':
                        return format.zipcode(value, value);
                        
                        case 'cpf':
                        return format.cpf(value, value);
                        
                        case 'cpfCnpj':
                        return format.cpfCnpj(value, value);
                        
                        case 'phone':
                        return format.phone(value, value);

                        case 'birthday':
                        return format.birthday(value, value);
                           
                        case 'money':
                           let v = value.replace(/\D/g, '');
                           v = (Number(v) / 100).toFixed(2) + '';
                           v = v.replace('.', ',');
                           v = v.replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,');
                           v = v.replace(/(\d)(\d{3}),/g, '$1.$2,');
                        return v;

                        case "moneyNegative":
                           let negativo = '';
                           let money = value;

                           negativo = money && money.indexOf('-') >= 0 ? '-' : '';
                           money = money.replace(/\D/g, "");
                           money = (Number(money) / 100).toFixed(2) + "";
                           money = money.replace(".", ",");
                           money = money.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
                           money = money.replace(/(\d)(\d{3}),/g, "$1.$2,");
                           value = negativo === '-' ? negativo + money : money;

                        return value;

                        case 'percentual':
                           let valor = value.replace(/\D/g, '');
                           if((Number(valor) / 100) <= 100){
                              return (Number(valor) / 100).toFixed(2) + '';
                           }
                        break;

                        case 'number':
                           value = String(value).replace(/[^\d]/g, '');
                        return value && parseInt(value);

                        default:
                        return value;
                     }
                  }else{
                     return "";
                  }
               }

               return variant && variant == 'outlined' ? (
                  <TextField
                     id={name}
                     type={type}
                     value={value ?? ""}
                     defaultValue=""
                     onBlur={onBlur}
                     onChange={rest?.type ? (e) => onChange(value = formatarValor(e.target.value)) : onChange}
                     label={label}
                     fullWidth
                     {...rest}
                  />
               ) : (
                  <FormControl fullWidth error={Boolean(error)} sx={{ ...theme.typography.customInput }}>
                     <InputLabel htmlFor={name}>{label}</InputLabel>
                     <OutlinedInput
                        id={name}
                        type={type}
                        value={value ?? ""}
                        defaultValue=""
                        onBlur={onBlur}
                        onChange={rest?.type ? (e) => onChange(value = formatarValor(e.target.value)) : onChange}
                        inputProps={{}}
                        {...rest}
                     />
                  </FormControl>
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
   ) : (
      variant && variant == 'outlined' ? (
         <TextField
            id={name}
            type={type}
            value={rest?.value ?? ""}
            label={label}
            fullWidth
            {...rest}
         />
      ) : (
         <FormControl fullWidth error={Boolean(error)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor={name}>{label}</InputLabel>
            <OutlinedInput
                  id={name}
                  type={type}
                  value={rest?.value ?? ""}
                  inputProps={{}}
                  {...rest}
            />
         </FormControl>
      )
   )
}