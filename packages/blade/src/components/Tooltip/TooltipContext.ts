import React from 'react';

type TooltipContext = true | null;
const TooltipContext = React.createContext<TooltipContext>(null);

const useTooltipContext = (): TooltipContext => {
  const context = React.useContext(TooltipContext);

  return context;
};

export { TooltipContext, useTooltipContext };
