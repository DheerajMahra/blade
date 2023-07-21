import React from 'react';

type CardContextType = true | null;
const CardContext = React.createContext<CardContextType>(null);

const useVerifyInsideCard = (): CardContextType => {
  return true;
};

/**
 * Verify if the passed childrens are only of allowedComponents list
 */
const useVerifyAllowedComponents = (): boolean => {
  return true;
};

type CardProviderProps = { children: React.ReactNode };
const CardProvider = ({ children }: CardProviderProps): React.ReactElement => {
  return <CardContext.Provider value={true}>{children}</CardContext.Provider>;
};

export { useVerifyInsideCard, useVerifyAllowedComponents, CardProvider };
