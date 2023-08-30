import { useState, useEffect } from 'react';

// material-ui
import { Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

// project import
import AddGrupoUsuario from './AddGrupoUsuario';
import FiltroGrupoUsuario from './FiltroGrupoUsuario';

// assets
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

// Services
import { buscarGruposUsuarios } from '../../../../services/administracao';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../../components/DataTable";
import funcoes from '../../../../utils/funcoes';

// ==============================|| GRUPO DE USUÁRIOS ||============================== //

const GruposUsuarios = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [gruposUsuarios, setGruposUsuarios] = useState([]);
   const [grupoSelecionado, setGrupoSelecionado] = useState(null);
   const [filtro, setFiltro] = useState(null);

   // drawer
   const [openDrawer, setOpenDrawer] = useState(false);
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   const getGruposUsuarios = async(user, filtro) => {
      const result = await buscarGruposUsuarios(user, filtro);
      setGruposUsuarios(result);
   }

   const handleEdit = async(data) => {
      setGrupoSelecionado(data);
      setOpenDrawer(!openDrawer);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getGruposUsuarios(user, data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getGruposUsuarios(user);
      handleLoad(false);
   }

   async function getGruposCloseDrawer(){
      handleLoad(true);
      await getGruposUsuarios(user, filtro);
      setOpenDrawer(!openDrawer);
      setGrupoSelecionado(null);
      handleLoad(false);
   }

   useEffect(()=> {
      async function initComponent(){
         await getGruposUsuarios(user);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.gru_id, grow: 0 },
         { name: 'Nome', selector: row => row.gru_nome },
         { name: 'Descrição', selector: row => row.gru_descricao, grow: 2 },
         { name: 'Ação', selector: row => row.acao, grow: 0 }
      ],
      rows: 
         gruposUsuarios &&
         gruposUsuarios.map((x) => ({
            gru_id: x.gru_id,
            gru_nome: x.gru_nome,
            gru_descricao: x.gru_descricao ? funcoes.limitarTexto(x.gru_descricao, 100) : '-',
            acao: (
               <Stack direction="row" justifyContent="center" alignItems="center">
                  <Tooltip placement="top" title="Editar">
                     <IconButton color="primary" aria-label="editar" size="large" onClick={()=> handleEdit(x)}>
                        <EditIcon sx={{ fontSize: '1.1rem' }} />
                     </IconButton>
                  </Tooltip>
               </Stack>
            )
      }))
   };

    return (
        <>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingY={3} borderRadius='5px 5px 0px 0px'>
               <Tooltip title="Adicionar Centro de Custo">
                  <Button
                     variant="contained"
                     size="small"
                     color="secondary"
                     onClick={()=> setOpenDrawer(!openDrawer)}
                     endIcon={<AddIcon />}
                  >
                     NOVO
                  </Button>
               </Tooltip>
               <Tooltip title="Filtrar">
                  <Button
                     variant="contained"
                     size="small"
                     color="secondary"
                     onClick={()=> setOpenDrawerFiltro(!openDrawerFiltro)}
                     endIcon={<SearchIcon />}
                  >
                     FILTRO
                  </Button>
               </Tooltip>
               {
                  filtro &&
                  <Tooltip title="Limpar Filtro">
                     <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={handleClearFilter}
                        endIcon={<ClearIcon />}
                     >
                        LIMPAR FILTRO
                     </Button>
                  </Tooltip>
               }
            </Stack>
            <DateTable
               linhas={datatable.rows || []}
               colunas={datatable.columns || []}
            />

            <AddGrupoUsuario open={openDrawer} handleDrawerOpen={setOpenDrawer} grupoSelecionado={grupoSelecionado} getGruposCloseDrawer={getGruposCloseDrawer}/>
            <FiltroGrupoUsuario open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} />
        </>
    );
};

export default GruposUsuarios;
