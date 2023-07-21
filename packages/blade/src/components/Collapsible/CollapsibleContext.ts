import { createContext, useContext } from 'react';
import type { CollapsibleProps } from './Collapsible';

type CollapsibleContextState = {
  isExpanded: boolean;
  defaultIsExpanded: boolean;
  onExpandChange: (isExpanded: boolean) => void;
  direction: CollapsibleProps['direction'];
  collapsibleBodyId: string;
};

const CollapsibleContext = createContext<CollapsibleContextState | null>(null);

const useCollapsible = (): CollapsibleContextState => {
  const collapsibleContext = useContext(CollapsibleContext);
  // @ts-expect-error - asas
  return collapsibleContext;
};

export { CollapsibleContext, useCollapsible, CollapsibleContextState };
