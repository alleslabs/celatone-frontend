import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type HoverContextType = {
  hoveredText: string | null;
  setHoveredText: (text: string | null) => void;
};

const HoverContext = createContext<HoverContextType | undefined>(undefined);

export const HoverProvider = ({ children }: { children: React.ReactNode }) => {
  const [hoveredText, setHoveredText] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setHoveredText(null);
  }, [pathname]);

  return (
    <HoverContext.Provider value={{ hoveredText, setHoveredText }}>
      {children}
    </HoverContext.Provider>
  );
};

export const useHoverText = () => {
  const context = useContext(HoverContext);
  if (!context)
    throw new Error("useHoverText must be used within HoverProvider");
  return context;
};
