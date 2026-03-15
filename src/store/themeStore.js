/**
 * Zustand store for theme management (dark/light mode)
 * Persists preference to localStorage
 */
import { create } from 'zustand';

const getInitialTheme = () => {
  const stored = localStorage.getItem('vulnguard-theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('vulnguard-theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { theme: newTheme };
  }),
  
  setTheme: (theme) => set(() => {
    localStorage.setItem('vulnguard-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme };
  }),
}));

export default useThemeStore;
