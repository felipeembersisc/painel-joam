import { useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// Hooks
import useAuth from '../../hooks/useAuth';
import { useLoad } from '../../hooks/useLoad';

const DashBoard = () => {
   const { user } = useAuth();

   const theme = useTheme();
   const { handleLoad } = useLoad();

   useEffect(() => {

   }, []);

   return (
      <>

      </>
   );
};

export default DashBoard;
