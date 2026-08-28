import { createContext, useContext, useState } from 'react';

const ProductModalContext = createContext(null);

export function ProductModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ProductModalContext.Provider value={{
      isOpen,
      openModal: () => setIsOpen(true),
      closeModal: () => setIsOpen(false),
    }}>
      {children}
    </ProductModalContext.Provider>
  );
}

export function useProductModal() {
  const ctx = useContext(ProductModalContext);
  if (!ctx) throw new Error('useProductModal must be used within ProductModalProvider');
  return ctx;
}
