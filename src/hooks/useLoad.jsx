import { createContext, useContext, useState } from "react";
import Loader from '@/ui-component/Loader';

const LoadContext = createContext();

export function LoadProvider({ children }) {
   const [load, setLoad] = useState(false);

   function handleLoad(value) {
      setLoad(value);
   }

   return (
      <LoadContext.Provider value={{ load, handleLoad }}>
         { load && <Loader /> }
         {children}
      </LoadContext.Provider>
   );
}

export function useLoad() {
   const context = useContext(LoadContext);
   return context;
}
