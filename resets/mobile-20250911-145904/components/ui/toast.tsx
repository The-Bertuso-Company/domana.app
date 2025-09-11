import React from 'react';
type Toast = { title?: string; description?: string; variant?: 'default'|'destructive' };
const Ctx = React.createContext({ toast: (_:Toast)=>{} });
export const ToastProvider: React.FC<{children: React.ReactNode}> = ({children}) =>
  <Ctx.Provider value={{toast: ()=>{}}}>{children}</Ctx.Provider>;
export const useToast = () => React.useContext(Ctx);
export const Toaster = () => null;
