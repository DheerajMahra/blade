import getIn from 'lodash/get';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import type { IconComponent } from '../Icons';
import { ListProvider, useListContext } from './ListContext';
import { UnorderedList } from './UnorderedList';
import { OrderedList } from './OrderedList';
import type { ListItemProps } from './ListItem';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { DotNotationSpacingStringToken, TestID } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSpace } from '~utils/makeSpace';
import { makeAccessible } from '~utils/makeAccessible';
import { isValidAllowedChildren } from '~utils/isValidAllowedChildren';

type ListCommonProps = {
  /**
   * ListItem to be rendered for the List.
   *
   */
  children: React.ReactElement<ListItemProps> | React.ReactElement<ListItemProps>[];
  /**
   * Sets the variant to be rendered for the List.
   *
   * @default 'unordered'
   */
  variant?: 'unordered' | 'ordered' | 'ordered-filled';
  /**
   * Sets the size for the List.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium';
} & TestID &
  StyledPropsBlade;

type ListWithIconProps = ListCommonProps & {
  variant?: 'unordered';
  icon?: IconComponent;
};
type ListWithoutIconProps = ListCommonProps & {
  variant?: 'ordered' | 'ordered-filled';
  icon?: undefined;
};
type ListProps = ListWithIconProps | ListWithoutIconProps;

const StyledOrderedList = styled(OrderedList)<{ marginTop?: DotNotationSpacingStringToken }>(
  ({ marginTop, theme }) => ({
    marginTop: marginTop ? makeSpace(getIn(theme, marginTop)) : undefined,
  }),
);

const StyledUnorderedList = styled(UnorderedList)<{ marginTop?: DotNotationSpacingStringToken }>(
  ({ marginTop, theme }) => ({
    marginTop: marginTop ? makeSpace(getIn(theme, marginTop)) : undefined,
  }),
);

/**
 * List Component is used to display a set of related items that are composed of text/links. Each list item begins with a bullet or a number.
 *
 * ## Usage
 *
 * ```tsx
 *   <List
 *     variant='unordered'
 *     size='medium'
 *   >
 *    <ListItem>
 *      Item 1
 *      <List>
 *        <ListItem>Item 1.1</ListItem>
 *      </List>
 *    </ListItem>
 *    <ListItem>Item 2</ListItem>
 *  <List />
 * ```
 */
const _List = ({
  variant = 'unordered',
  size,
  children,
  icon,
  testID,
  ...styledProps
}: ListProps): React.ReactElement => {
  const ListElement = variant === 'unordered' ? StyledUnorderedList : StyledOrderedList;
  const { level, size: listContextSize } = useListContext();
  const listContextValue = useMemo(
    () => ({
      level: level ? level + 1 : 1,
      size: size ?? listContextSize,
      icon,
      variant,
    }),
    [icon, level, listContextSize, size, variant],
  );

  const childrenArray = React.Children.toArray(children);
  // @ts-expect-error - asas
  const childListItems = childrenArray.filter((child) => {
    if (isValidAllowedChildren(child, MetaConstants.ListItem)) {
      return child;
    }
  });

  return (
    <ListProvider value={listContextValue}>
      <BaseBox {...getStyledProps(styledProps)}>
        <ListElement
          marginTop={level ? undefined : 'spacing.3'}
          {...metaAttribute({ name: MetaConstants.List, testID })}
          {...makeAccessible({ role: 'list' })} // Role needed for react-native
        >
          {variant === 'unordered'
            ? childListItems
            : childListItems.map(
                (child, index) =>
                  React.cloneElement(child as React.ReactElement, { _itemNumber: index + 1 }), // adds _itemNumber for rendering ordered list bullets
              )}
        </ListElement>
      </BaseBox>
    </ListProvider>
  );
};

const List = assignWithoutSideEffects(_List, { componentId: MetaConstants.List });

export { List };
export type { ListProps };
