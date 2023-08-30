import { utils, writeFileXLSX ,  } from 'xlsx';
import { Button, Tooltip } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { toast } from 'react-toastify';

export function ExcelExport({ excelData, fileName }){
   const fileExtension  = '.xlsx';

   async function exportToExcel() {
      if(excelData.length <= 0){
         return toast.info('Nenhum dado encontrado 😅');
      }

      const ws = utils.json_to_sheet(excelData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Data');
      writeFileXLSX(wb, fileName + fileExtension)
   }

   return (
      <Tooltip title="Exportar Excel">
         <Button
            variant="contained"
            size="small"
            color="success"
            sx={{color: '#FFF'}}
            endIcon={<InsertDriveFileIcon />}
            onClick={exportToExcel}
         >
            EXPORTAR
         </Button>
      </Tooltip>
   )
}