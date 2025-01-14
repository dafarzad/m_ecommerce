"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ModalProviderProps = {
  children: ReactNode;
};

type ModalContextType = {
  data: any;
  isOpen: boolean;
  setOpen?: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose?: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
});

function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const [showingModal, setShowingModal] = useState<ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function setOpen(
    modal: React.ReactNode,
    fetchData?: () => Promise<any>,
  ) {
    if (modal && fetchData) {
      setData({ ...data, ...(await fetchData()) });
    }
    setShowingModal(modal);
    setIsOpen(true);
  }

  function setClose() {
    setIsOpen(false);
    setData({});
  }

  if (!isMounted) return null;

  return (
    <ModalContext value={{ setOpen, setClose, data, isOpen }}>
      {children}
      {showingModal}
    </ModalContext>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModel must be used withing a ModalProvider");
  }
  return context;
};

export default ModalProvider;
