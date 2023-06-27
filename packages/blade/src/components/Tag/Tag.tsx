import React from 'react';
import { StyledTag } from './StyledTag';
import { Box } from '~components/Box';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import type { StringChildrenType, TestID } from '~src/_helpers/types';
import { metaAttribute, MetaConstants } from '~utils';

type TagProps = {
  /**
   * Decides the size of Tag
   *
   * @default medium
   */
  size?: 'medium' | 'large';

  /**
   * Callback when close icon on Tag is clicked
   */
  onDismiss?: ({ value }: { value: StringChildrenType }) => void;

  /**
   * Text that renders inside Tag
   */
  children: StringChildrenType;

  /**
   * Disable tag
   */
  isDisabled?: boolean;
} & StyledPropsBlade &
  TestID;

const Tag = ({
  size = 'medium',
  onDismiss,
  children,
  isDisabled,
  testID,
  ...styledProps
}: TagProps): React.ReactElement | null => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <StyledTag
      backgroundColor="brand.gray.a100.lowContrast"
      borderRadius="max"
      borderWidth="none"
      padding={
        size === 'medium'
          ? ['spacing.1', 'spacing.2', 'spacing.1', 'spacing.3']
          : ['spacing.2', 'spacing.3', 'spacing.2', 'spacing.4']
      }
      {...getStyledProps(styledProps)}
      {...metaAttribute({ name: MetaConstants.Tag, testID })}
    >
      <Box display="flex" flexDirection="row" flexWrap="nowrap">
        <Text marginRight="spacing.2" type="subtle" contrast="low" size="small">
          {children}
        </Text>
        <IconButton
          size="small"
          icon={CloseIcon}
          accessibilityLabel={`Close ${children} tag`}
          onClick={() => {
            setIsVisible(false);
            onDismiss?.({ value: children });
          }}
        />
      </Box>
    </StyledTag>
  );
};

export { Tag, TagProps };