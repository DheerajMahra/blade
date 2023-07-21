import { useContext, createContext } from 'react';
import type { UseColorScheme } from '../../utils/useColorScheme';
import type { Theme } from './';
import type { TypographyPlatforms } from '~tokens/global';

export type ThemeContext = UseColorScheme & {
  theme: Theme;
  platform: TypographyPlatforms;
};

export const ThemeContext = createContext<ThemeContext>({
  // @ts-expect-error set null
  theme: null,
  colorScheme: 'light',
  platform: 'onDesktop',
  setColorScheme: () => null,
});

const useTheme = (): ThemeContext => {
  const themeContext = useContext<ThemeContext>(ThemeContext);
  return themeContext;
};

export default useTheme;
