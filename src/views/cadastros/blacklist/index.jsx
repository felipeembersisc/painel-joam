import { useState, useEffect } from 'react';

// material-ui
import { Button, Stack, Tooltip } from '@mui/material';

// assets
import AddIcon from '@mui/icons-material/Add';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../components/DataTable";

// ==============================|| ATIVOS ||============================== //

const Blacklist = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const [ativos, setAtivos] = useState([]);
  useEffect(() => {
    // initComponent();
  }, [])

  const datatable = {
    columns: [
      { name: '#ID', selector: null, grow: 0 },
      { name: 'CNPJ', selector: null },
      { name: 'EMPRESA', selector: null },
      { name: 'BLOQUEADO EM', selector: null },
      { name: 'BLOQUEADO POR', selector: null },
      { name: 'Ação', selector: null }
    ],
    rows: []
  };

  return (
    <>
      <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingY={3} borderRadius='5px 5px 0px 0px'>
        <Tooltip title="Adicionar Ativo">
          <Button
            variant="contained"
            size="small"
            color="secondary"
            endIcon={<AddIcon />}
          >
            ADD ÚNICO
          </Button>
        </Tooltip>
      </Stack>
      <DateTable
        linhas={datatable.rows || []}
        colunas={datatable.columns || []}
      />

      {/* <AddAtivosEscritorio open={openAddDocumento} setOpen={setOpenAddDocumento} escritorios={escritorios} centrosCusto={centrosCusto} getAtivos={getAtivos} /> */}
    </>
  );
};

export default Blacklist;
