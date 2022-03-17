import { useContext, createContext } from 'react';
import { Colors, Shadows, ShadowLevels } from '../../tokens/theme/theme.d';
import type { Border } from '../../tokens/global/border';
import type { Breakpoints } from '../../tokens/global/breakpoints';
import type { Spacing } from '../../tokens/global/spacing';
import type { Typography } from '../../tokens/global/typography';
import type { UseColorScheme } from '../../utils/useColorScheme';
import emptyTheme from './emptyTheme';

export type Theme = {
  border: Border;
  breakpoints: Breakpoints;
  colors: Colors;
  spacing: Spacing;
  shadows: Omit<Shadows, 'color'> & {
    color: {
      level: Record<ShadowLevels, string>;
    };
  };
  typography: Typography;
};

export type ThemeContext = UseColorScheme & {
  theme: Theme;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: emptyTheme,
  colorScheme: 'light',
  setColorScheme: () => null,
});

const useTheme = (): ThemeContext => {
  const themeContext = useContext<ThemeContext>(ThemeContext);
  if (themeContext === undefined) {
    throw new Error(`[@razorpay/blade:BladeProvider]: useTheme must be used within BladeProvider`);
  }
  return themeContext;
};

export default useTheme;
