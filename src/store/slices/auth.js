// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import { dispatch, useSelector } from '../index';
import instance from '../../services';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

const initialState = {
   isLoggedIn: false,
   isCodeVerification: false,
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
      
      // VALIDATE DOUBLE FACTOR USER
      validateDoubleFactor(state) {
         state.isCodeVerification = true;
      },

      // VERIFICATE EMAIL DOUBLE FACTOR USER
      emailVerificationDoubleFactor(state) {
         state.isEmailVerification = true;
      },

      // SAVE DOUBLE FACTOR USER
      saveDoubleFactor(state, action) {
         state.user = {
            ...state.user,
            usu_duplo_fator: action.payload
         }
      },

      // LOGOUT USER
      logout(state) {
         state.user = null;
         state.isLoggedIn = false;
         state.isCodeVerification = false;
         state.isEmailVerification= false;
      },
   }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export async function autenticar(login_usu, senha_usu) {
   try {
      const response = await instance.post('auth/logar', { login_usu, senha_usu });
      const { data, status } = response;
      if(status === 200){
         dispatch(slice.actions.login(data));

         let secret = "";
         if (!data.usu_duplo_fator) {
            secret = await getTokenDubleFactor();
         }

         return secret;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
}

export async function getTokenDubleFactor() {
   try {
      const resultSecret = await instance.get('auth/buscar/duplo-fator');
      const { status, data } = resultSecret;
      if (status === 200) {
         return data;
      } else {
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
}

export async function saveDoubleFactor(dadosAuth, secret) {
   try {
      const response = await instance.post( 'auth/registrar/duplo-fator', { secret }, { headers: { Authorization: `Bearer ${dadosAuth.token}` } });
      const { data, status } = response;
      
      if(status === 200 && data.usu_id){
         dispatch(slice.actions.saveDoubleFactor(secret));
      }
   } catch (error) {
      toast.error('Erro ao salvar o token de autenticação, tente novamente 😅');
   }
}

export async function validarDuploFator(dadosAuth, cod_google) {
   try {
      const response = await instance.post('auth/validar/duplo-fator', { cod_google }, { headers: { Authorization: `Bearer ${dadosAuth.token}` } });
      const { data, status } = response;
      
      if(status === 200){
         if(data){
            dispatch(slice.actions.validateDoubleFactor());
         }else{
            toast.info('Código incorreto, tente o próximo 😅');
         }
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
}

export async function emailVerificationDoubleFactor(dadosAuth) {
   try {
      const response = await instance.get('auth/verificar-email/duplo-fator', { headers: { Authorization: `Bearer ${dadosAuth.token}` } });
      const { data, status } = response;

      if(status === 200 && data){
         dispatch(slice.actions.emailVerificationDoubleFactor());
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
}

export async function resetDoubleFactor(dadosAuth, codigo) {
   try {
      const response = await instance.post('auth/reset/duplo-fator', { codigo }, { headers: { Authorization: `Bearer ${dadosAuth.token}` } });
      const { data, status } = response;

      if(status === 200 && data){
         dispatch(slice.actions.logout());
         toast.success('Duplo fator resetado com sucesso, acesse novamente 😁');
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
}

export async function resetPassword(login) {
   try {
      const response = await instance.post('auth/reset/senha', { login });
      const { data, status } = response;

      if(status === 200 && data){
         toast.success('Enviado um link de redefinição da senha no email cadastrado 😁');
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
}

export async function savePassword(senha, hash) {
   try {
      const response = await instance.post('auth/validar/salvar-senha', { senha, hash });
      const { data, status } = response;

      if(status === 200 && data){
         toast.success('Sua senha foi redefinida com sucesso 😁');
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
}

export async function verificarHashTrocarSenha(hash) {
   try {
      const response = await instance.post('auth/validar/hash-trocar-senha', { hash });
      const { data, status } = response;

      if(status === 200 && data){
         return data;
      }else{
         throw Error(data.message);
      }
   } catch (err) {
      toast.error(err.message);
   }
}

export async function verificarStatusToken(token) {
   try {
      const response = await instance.post('auth/status', { token });
      const { data, status } = response;

      if(status === 200){
         return;
      }else{
         throw Error(data)
      }
   } catch (error) {
      dispatch(slice.actions.logout());
   }
}

export async function logout() {
   dispatch(slice.actions.logout());
}
