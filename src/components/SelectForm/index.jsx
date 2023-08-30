import { useState } from 'react';

//Styles
import { Controller } from 'react-hook-form';
import { Autocomplete, FormControl, TextField, Typography } from '@mui/material';

export function SelectForm({ options, name, label, error, required, ...rest }) {
   // const [value, setValue] = useState(options[0]);
   const [inputValue, setInputValue] = useState('');

   return rest.control ? (
      <>
         <Controller
               control={rest.control}
               rules={{ required: required }}
               render={({ field: { onChange, onBlur, value } }) => {
                  return (
                     <Autocomplete
                        options={options}
                        onBlur={onBlur}
                        isOptionEqualToValue={(option, val) => option?.id === (val?.id ? val.id : val)}
                        getOptionLabel={(option) =>
                           ['number', 'boolean', 'string'].includes(typeof option) && options.length > 0
                              ? options.find((op) => op.id == option)?.label
                              : typeof option == 'number'
                              ? String(option)
                              : String(option?.label)
                        }
                        value={value}
                        defaultValue={rest?.multiple ? [] : null}
                        onChange={(event, newValue) => onChange((value = rest?.multiple ? newValue.map(nv => nv?.id ?? nv) : newValue?.id ?? null))}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                           setInputValue(newInputValue);
                        }}
                        renderInput={(params) => <TextField {...params} label={label} />}
                        fullWidth
                        {...rest}
                     />
                  );
               }}
               name={name}
         />
         {error && (
               <FormControl fullWidth>
                  <Typography color="red" ml={0.5} mb={0.5} fontSize={13}>
                     {error}
                  </Typography>
               </FormControl>
         )}
      </>
   ) : (
      <Autocomplete
         options={options}
         isOptionEqualToValue={(option, val) => option.id === (val?.id ? val.id : val)}
         getOptionLabel={(option) =>
            typeof option == 'number' && options.length > 0
               ? options.find((op) => op.id == option)?.label
               : typeof option == 'number'
               ? String(option)
               : String(option?.label)
         }
         inputValue={inputValue}
         onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
         }}
         renderInput={(params) => <TextField {...params} label={label} />}
         fullWidth
         {...rest}
      />
   );
}
