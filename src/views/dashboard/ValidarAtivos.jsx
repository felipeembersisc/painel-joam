import { useState } from 'react';

// material-ui
import { Checkbox, FormControlLabel } from '@mui/material';

// Hooks
import { useTheme } from '@mui/material/styles';
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';

// Components
import { SimpleModal } from '../../../../components/Modal';

// Assets
import termoFilial from '../../../../docs/termo_de_compromisso_filial.pdf';

// ==============================|| VALIDAR ATIVOS ||============================== //

const ValidarAtivos = ({ open, setOpen, handleCheckTermoCompromisso }) => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [aceiteTermo, setAceiteTermo] = useState(false);

   return (
      <SimpleModal
         open={open}
         setOpen={setOpen}
         title="Aceitar Termo De Compromisso"
         style= {{
            width: { xs: 280, lg: 800 },
            height: { xs: '90vh' }
         }}
      >
         <embed src={termoFilial} type="application/pdf" width="100%" height="90%" style={{ border: 0 }}></embed>
         <FormControlLabel
            sx={{ marginTop: '10px' }}
            control={
               <Checkbox
                  checked={aceiteTermo}
                  onChange={handleCheckTermoCompromisso}
                  color='success' 
                  sx={{
                     color: theme.palette.success.main,
                     '&.Mui-checked': { color: theme.palette.success.main },
                  }}
               />
            } 
            label={`Eu ${user.usu_nome}, confirmo que li e aceito todos os termos acima.`}
         />
      </SimpleModal>
   );
};

export default ValidarAtivos;
