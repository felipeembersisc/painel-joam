// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import { dispatch, useSelector } from '../index';
import instance from '../../services';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

const initialState = {
   isLoggedIn: false,
   isEmailVerification: false,
   user: null
};

const slice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      // HAS ERROR
      hasError(state, action) {
         state.error = action.payload;
      },

      // ADD USER
      register(state, action) {
         state.user = action.payload;
      },

      // LOGIN USER
      login(state, action) {
         state.user = action.payload;
         state.isLoggedIn = true;
      },

      // LOGOUT USER
      logout(state) {
         state.user = null;
         state.isLoggedIn = false;
      },
   }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export async function autenticar(login_usu, senha_usu) {
   try {
      const response = await instance.post('autenticar/administrativo/logar', { login_usu, senha_usu });
      const { data, status } = response;
      if (status === 200 && data.dados) {
         dispatch(slice.actions.login(data.dados));
         return true;
      } else {
         throw Error(data.mensagem);
      }
   } catch (err) {
      toast.error(err.mensagem);
   }
}

export async function resetPassword(email_usu) {
   try {
      const response = await instance.post('autenticar/forgot', { email_usu });
      const { data } = response;
      return data;
   } catch (err) {
      toast.error(err.message);
   }
}

export async function savePassword(senha, hash) {
   try {
      const response = await instance.post('auth/validar/salvar-senha', { senha, hash });
      const { data, status } = response;

      if (status === 200 && data) {
         toast.success('Sua senha foi redefinida com sucesso 😁');
         return data;
      } else {
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
}


export async function verificarStatusToken(token) {
   try {
      const response = await instance.post('autenticar/status', { token });
      const { data, status } = response;

      if (status === 200) {
         return;
      } else {
         throw Error(data)
      }
   } catch (error) {
      dispatch(slice.actions.logout());
   }
}

export async function logout() {
   dispatch(slice.actions.logout());
}
