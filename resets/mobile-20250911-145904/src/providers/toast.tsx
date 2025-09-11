import React, { createContext, useContext } from 'react';
type ToastFn = (opts?: { title?: string; description?: string; type?: 'success' | 'error' | 'info' }) => void;
const Ctx = createContext<ToastFn>(() => {});
export const useToast = () => useContext(Ctx);
export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Ctx.Provider value={() => {}}>{children}</Ctx.Provider>
);
