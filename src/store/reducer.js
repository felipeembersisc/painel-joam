// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import menuReducer from './slices/menu';
import authReducer from './slices/auth';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
   snackbar: snackbarReducer,
   menu: menuReducer,
   auth: persistReducer(
      {
          key: 'auth',
          storage,
          keyPrefix: 'poupa-'
      },
      authReducer
   )
});

export default reducer;
