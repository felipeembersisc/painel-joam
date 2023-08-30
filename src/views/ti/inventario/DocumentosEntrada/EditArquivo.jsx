import { useState } from 'react';

// material-ui
import {
    Button,
    Grid,
    Stack
} from '@mui/material';

// Services
import { editarArquivoDocumento } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';

// Components
import { SimpleModal } from '../../../../components/Modal';
import { InputForm } from '../../../../components/InputForm';

// Utils
import funcoes from '../../../../utils/funcoes';

// Form
import { useForm } from 'react-hook-form';

// ==============================|| EDITAR ARQUIVO DO DOCUMENTO ||============================== //

const EditArquivo = ({ open, setOpen, documento, getDocumentos }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();
   const { control } = useForm();

   const [arquivo, setArquivo] = useState(null);

   const handleSave = async () => {
      let file = document.getElementById('arquivo_documento').files;
      let fileValidado = await funcoes.validarArquivo(file, ['application/pdf'], 2);
      
      if(!fileValidado) return;
      
      try {
         handleLoad(true);

         let base64 = await funcoes.toBase64(file[0]);

         if(base64){
            await editarArquivoDocumento(user, documento, { base64, file: { name: file[0].name, type: file[0].type } });
         }
      } catch (error) {
      }finally{
         await getDocumentos(user);
         setOpen(!open);
         handleLoad(false);
      }
   };

   return (
      <SimpleModal
         open={open}
         setOpen={setOpen}
         title="Alterar documento"
         style= {{
            width: { xs: 280, lg: 640 }
         }}
         actions={
            <Stack flex={1} justifyContent="flex-end" alignItems="flex-end">
                <Button variant="contained" size="medium" color="secondary" onClick={handleSave}>
                    Enviar
                </Button>
            </Stack>
        }
      >
         <Grid container spacing={2} justifyContent="center" alignItems="center" paddingTop={3}>
            <InputForm
               id='arquivo_documento'
               name="arquivo_documento"
               control={control}
               value={arquivo}
               variant='outlined'
               type="file"
            />
         </Grid>
      </SimpleModal>
   );
};

export default EditArquivo;
