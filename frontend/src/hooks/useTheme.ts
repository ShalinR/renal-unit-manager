import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  const cycleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const getThemeIcon = () => {
    if (theme === 'light') {
      return 'sun';
    }
    if (theme === 'dark') {
      return 'moon';
    }
    return 'system';
  };

  return { theme, cycleTheme, getThemeIcon };
}
