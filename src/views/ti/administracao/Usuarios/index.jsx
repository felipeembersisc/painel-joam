import { useState, useEffect } from 'react';

// material-ui
import { Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

// assets
import AssignmentIcon from '@mui/icons-material/Assignment';
import KeyIcon from '@mui/icons-material/Key';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Services
import { buscarEscritoriosSelect, buscarFuncionarios } from '../../../../services/inventario';
import { buscarGruposUsuariosSelect, buscarUsuarios } from '../../../../services/administracao';

// Utils
import moment from 'moment/moment';
import funcoes from '../../../../utils/funcoes';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../../components/DataTable";
import DetalhesUsuario from './DetalhesUsuario';
import FiltroUsuario from './FiltroUsuario';
import ResetarSenhaUsuario from './ResetarSenhaUsuario';

// ==============================|| USUÁRIOS ||============================== //

const Usuarios = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [usuarios, setUsuarios] = useState([]);
   const [gruposUsuarios, setGruposUsuarios] = useState([]);
   const [funcionarios, setFuncionarios] = useState([]);
   const [escritorios, setEscritorios] = useState([]);
   const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
   const [filtro, setFiltro] = useState(null);

   // Modal
   const [openDetalhes, setOpenDetalhes] = useState(false);
   const [openResetarSenha, setOpenResetarSenha] = useState(false);

   //  Drawer
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   const getUsuarios = async(filtro) => {
      const result = await buscarUsuarios(user, filtro);
      setUsuarios(result);
   }

   const getGruposUsuarios = async() => {
      const result = await buscarGruposUsuariosSelect(user);
      setGruposUsuarios(result);
   }

   const getFuncionarios = async() => {
      const result = await buscarFuncionarios(user);
      setFuncionarios(result);
   }

   const getEscritorios = async() => {
      const result = await buscarEscritoriosSelect(user);
      setEscritorios(result);
   }

   const handleEdit = async(type, data) => {
      handleLoad(true);
      switch(type){
         case 'detalhes':
            setOpenDetalhes(true);
            setUsuarioSelecionado(data);
         break;
         case 'resetarSenha':
            setOpenResetarSenha(true);
            setUsuarioSelecionado(data);
         break;
      }
      handleLoad(false);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getUsuarios(data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getUsuarios();
      handleLoad(false);
   }

   useEffect(()=> {
      async function initComponent(){
         handleLoad(true);
         await getFuncionarios();
         await getEscritorios();
         await getUsuarios();
         await getGruposUsuarios();
         handleLoad(false);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.usu_id, grow: 0, sortable: true},
         { name: 'Login', selector: row => row.usu_login, sortable: true },
         { name: 'Funcionario', selector: row => row.fun_nome, sortable: true },
         { name: 'Ultimo login', selector: row => row.usu_ultimo_login, sortable: true },
         { name: 'Criado em', selector: row => row.usu_criado_em, sortable: true },
         { name: 'Status', selector: row => row.usu_is_ativo, sortable: true },
         { name: 'Ação', selector: row => row.acao }
      ],
      rows:
         usuarios &&
         usuarios.map((x) => ({
            usu_id: x.usu_id,
            usu_login: x.usu_login,
            fun_nome: x.funcionario ? funcoes.camelCase(x.funcionario.fun_nome) : '-',
            usu_ultimo_login: x.usu_ultimo_login ? moment(x.usu_ultimo_login).format('DD/MM/YYYY') : 'Sem Registro',
            usu_criado_em: moment(x.usu_criado_em).format('DD/MM/YYYY'),
            usu_is_ativo: (
               <Chip
                  label={x.usu_is_ativo ? 'Ativo' : 'Inativo'}
                  size="medium"
                  sx={{ 
                     color: x.usu_is_ativo ? 'success.main' : 'error.main',
                     fontWeight: 'medium'
                  }}
               />
            ),
            acao: (
               <Stack direction="row" justifyContent="center" alignItems="center">
                  <Tooltip placement="top" title="Alterar Senha">
                     <IconButton color="primary" aria-label="alterar-senha" size="large" onClick={()=> handleEdit('resetarSenha', x)}>
                        <KeyIcon sx={{ fontSize: '1.2rem' }} />
                     </IconButton>
                  </Tooltip>
                  <Tooltip placement="top" title="Ver Detalhes">
                     <IconButton color="primary" aria-label="ver-detalhes" size="large" onClick={()=> handleEdit('detalhes', x)}>
                        <AssignmentIcon sx={{ fontSize: '1.2rem' }} />
                     </IconButton>
                  </Tooltip>
               </Stack>
            )
      }))
   };

   return (
      <>
         <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingY={3} borderRadius='5px 5px 0px 0px'>
            <Tooltip title="Filtrar">
               <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={setOpenDrawerFiltro}
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

         <ResetarSenhaUsuario open={openResetarSenha} setOpen={setOpenResetarSenha} setUsuarioSelecionado={setUsuarioSelecionado} usuarioSelecionado={usuarioSelecionado} getUsuarios={getUsuarios}/>
         <DetalhesUsuario open={openDetalhes} setOpen={setOpenDetalhes} setUsuarioSelecionado={setUsuarioSelecionado} usuarioSelecionado={usuarioSelecionado} funcionarios={funcionarios} gruposUsuarios={gruposUsuarios} getUsuarios={getUsuarios}/>
         <FiltroUsuario open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} funcionarios={funcionarios} escritorios={escritorios} gruposUsuarios={gruposUsuarios}/>
      </>
   );
};

export default Usuarios;
