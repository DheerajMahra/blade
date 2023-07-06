// eslint-disable-next-line import/no-cycle
import { convertStyleNameToBladeName, isBackgroundColorToken } from '../../utils/color';
import { getPaddingValue, getTokenFromSpacingValue } from '../../utils/spacing';
// eslint-disable-next-line import/no-cycle
import { generateServerCode } from '../../server';
import { LAYOUT_MODES } from './constants';
import { getFlexAlignmentFromAxisAlignment } from './utils';
import type { ServerFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeFrameNode, BladeGroupNode, BladeProps } from '~/code/types/Blade';

export const transformFrameOrGroup = async (
  bladeFrame: BladeFrameNode | BladeGroupNode,
): Promise<ServerFunctionReturnType> => {
  const props: BladeProps = {};

  // TODO groups can have item spacing as well
  // since item spacing figma property does not exist
  // for groups, use relative transform matrix to find the
  // distances between elements in a group
  if (bladeFrame.type === 'GROUP') {
    let children: ServerFunctionReturnType[] = [];
    if (bladeFrame.children && bladeFrame.children.length > 0) {
      children = await generateServerCode({
        bladeNodes: bladeFrame.children,
      });
    }

    return {
      componentName: 'Box',
      props,
      children: children ?? [],
    };
  }

  // --- Frame specific code below ---
  // --- Layout mode specific code below ---
  // TODO set alignItems and justifyContent when items don't fill the entire space
  if (
    bladeFrame.layoutMode === LAYOUT_MODES.VERTICAL ||
    bladeFrame.layoutMode === LAYOUT_MODES.HORIZONTAL
  ) {
    props.display = {
      value: 'flex',
      type: 'string',
    };

    props.flexDirection = {
      value: bladeFrame.layoutMode === 'VERTICAL' ? 'column' : 'row',
      type: 'string',
    };

    props.gap = {
      value: getTokenFromSpacingValue(bladeFrame.itemSpacing),
      type: 'string',
    };

    const justifyContent = getFlexAlignmentFromAxisAlignment(bladeFrame.primaryAxisAlignItems);
    const alignItems = getFlexAlignmentFromAxisAlignment(bladeFrame.counterAxisAlignItems);

    props.justifyContent = { value: justifyContent, type: 'string' };
    props.alignItems = { value: alignItems, type: 'string' };

    const paddingValue = getPaddingValue({
      top: bladeFrame.paddingTop,
      right: bladeFrame.paddingRight,
      bottom: bladeFrame.paddingBottom,
      left: bladeFrame.paddingLeft,
    });
    // always generate an array. easier to generate this syntax
    // since it works in all cases
    props.padding = {
      value:
        paddingValue.length > 1
          ? `[${paddingValue.map((value) => `"${value}"`).join(', ')}]`
          : paddingValue[0],
      type: paddingValue.length > 1 ? 'array' : 'string',
    };

    if (bladeFrame.maxHeight) {
      props.maxHeight = {
        value: `${bladeFrame.maxHeight}px`,
        type: 'string',
      };
    }

    if (bladeFrame.maxWidth) {
      props.maxWidth = {
        value: `${bladeFrame.maxWidth}px`,
        type: 'string',
      };
    }

    if (bladeFrame.layoutSizingVertical === 'FIXED') {
      props.height = {
        value: `${bladeFrame.height}px`,
        type: 'string',
      };
    }

    if (bladeFrame.layoutSizingHorizontal === 'FIXED') {
      props.width = {
        value: `${bladeFrame.width}px`,
        type: 'string',
      };
    }

    if (bladeFrame.layoutSizingVertical === 'FILL') {
      props.flex = {
        value: '1 0',
        type: 'string',
      };
    }

    if (bladeFrame.layoutSizingHorizontal === 'FILL') {
      props.flex = {
        value: '1 0',
        type: 'string',
      };
    }
  }
  // --- Layout mode specific end ---

  // TODO add support for fills array
  // TODO handle figma.mixed
  // --- Background color ---
  if (bladeFrame.fillStyleId !== figma.mixed) {
    const fillStyle = figma.getStyleById(bladeFrame.fillStyleId);
    if (fillStyle) {
      const styleName = fillStyle.name;
      const bladeTokenName = convertStyleNameToBladeName(styleName);
      const isValidToken = isBackgroundColorToken(bladeTokenName);

      props.backgroundColor = {
        value: bladeTokenName,
        type: 'string',
        isCommented: !isValidToken,
        comment: isValidToken
          ? ''
          : 'Only surface.background tokens are supported by Box component',
      };
    }
  }

  let children: ServerFunctionReturnType[] = [];
  if (bladeFrame.children && bladeFrame.children.length > 0) {
    children = await generateServerCode({
      bladeNodes: bladeFrame.children,
    });
  }

  return { componentName: 'Box', props, children: children ?? [] };
};
