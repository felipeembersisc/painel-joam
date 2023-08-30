import { useState } from 'react';
import { useNavigate } from "react-router-dom";

// material-ui
import {
    Button,
    Grid,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';

// Components
import { SimpleModal } from '../Modal';
import { SelectForm } from '../SelectForm';
import { ArrowRightAnimate } from '../ArrowRightAnimate';

// ==============================|| SELECIONAR EMPRESA PARA OPERAÇÕES ||============================== //

const ModalSelectEmpresa = ({ open, empresas, acao }) => {
   const navigate = useNavigate();

   function selecionarEmpresa(value){
      if(value){
         acao(value);
      }
   }

   return (
      <SimpleModal
         open={open}
         title="Selecionar Empresa"
         hiddenClose
         style= {{
            width: { xs: 280, lg: 840 }
         }}
      >
         {
            empresas.length > 0 ?
               <SelectForm
                  name="con_banco_id"
                  label="Empresas:"
                  onChange={(e, value) => selecionarEmpresa(value)}
                  options={empresas ?? []}
               />
            :
               <Grid container spacing={2} justifyContent="center" alignItems="center" paddingTop={3}>
                  <Grid item xs={6}>
                     <Typography fontSize={30} textAlign='center'>Nenhuma empresa <br/> cadastrada!</Typography>
                  </Grid>
                  <Grid item direction='row' xs={6}>
                     <Stack display='flex' flexDirection='row' justifyContent='space-around' alignItems='center'>
                        <ArrowRightAnimate open={true} />
                        <Tooltip title="Cadastrar Empresa">
                           <Button
                              variant="contained"
                              size="large"
                              color="secondary"
                              onClick={()=> navigate('/financeiro/cadastro-empresas')}
                           >
                              CADASTRE AQUI!
                           </Button>
                        </Tooltip>
                     </Stack>
                  </Grid>
               </Grid>
         }
      </SimpleModal>
   );
};

export default ModalSelectEmpresa;
