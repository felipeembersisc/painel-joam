//Styles
import { Container } from './styles';

// Components
import ReactDataTable, { createTheme } from 'react-data-table-component';

// Hooks
import { useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

export function DateTable({titulo, linhas, colunas, options, ...rest}){

   const theme = useTheme();

   createTheme('solarized', {
      // text: {
      //   primary: '#268bd2',
      //   secondary: '#2aa198',
      // },
      background: {
        default: theme.palette.dark.dark,
      },
      // context: {
      //   background: '#cb4b16',
      //   text: '#FFFFFF',
      // },
      // divider: {
      //   default: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.primary.light,
      // },
      // action: {
      //   button: 'rgba(0,0,0,.54)',
      //   hover: 'rgba(0,0,0,.08)',
      //   disabled: 'rgba(0,0,0,.12)',
      // },
    }, 'dark');

   //  Internally, customStyles will deep merges your customStyles with the default styling.
   const customStyles = {
      rows: {
         style: {
            minHeight: '72px', // override the row height
         },
      },
      table: {
         style: {
            borderRadius: '4px'
         },
      },
      headRow: {
         style: {
            borderRadius: '4px 4px 0 0'
         },
      },
      footer: {
         style: {
            borderRadius: '4px 4px 0 0'
         },
      },
   };

   const optionsDataTable = {
      direction:"auto",
      fixedHeaderScrollHeight:"300px",
      highlightOnHover: true,
      noHeader: rest.isClearFiltro ? false : true,
      pagination: true,
      responsive: true,
      striped: true,
      subHeaderAlign:"right",
      subHeaderWrap: true,
      paginationRowsPerPageOptions: [],
      paginationComponentOptions: {
         rowsPerPageText: 'Linhas por página:', 
         rangeSeparatorText: 'de', 
         noRowsPerPage: true, 
         selectAllRowsItem: false, 
         selectAllRowsItemText: 'All'
      },
      noDataComponent: (
         <Stack bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingBottom={2} width='100%' justifyContent='center' alignItems='center'>
            <Typography py={5}>
               Nenhum Dado Encontrado
            </Typography>
         </Stack>
      ),
      ...options,
      ...rest
   }

   return(
      <Container>
         <ReactDataTable
            title={titulo}
            data={linhas}
            columns={colunas}
            theme={theme.palette.mode === 'dark' ? 'solarized' : 'default'}
            customStyles={customStyles}
            {...optionsDataTable}
         />
      </Container>
   )
}