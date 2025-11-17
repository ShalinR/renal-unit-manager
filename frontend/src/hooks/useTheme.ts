import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  // Default to 'light' unless user previously saved 'dark'
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  const cycleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const getThemeIcon = () => (theme === 'light' ? 'sun' : 'moon');

  return { theme, cycleTheme, getThemeIcon };
}