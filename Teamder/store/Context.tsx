// Create a context (store/ThemeContext.js)
import { createContext, useState, useContext } from 'react';
import { ReactNode } from 'react';


const UserContext = createContext<{ theme: number; setTheme: React.Dispatch<React.SetStateAction<number>> } | undefined>(undefined);



export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(0);
  
  return (
    <UserContext.Provider value={{ theme, setTheme }}>
      {children}
    </UserContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}