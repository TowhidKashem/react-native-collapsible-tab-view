"use strict";

import React from 'react';
import { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { useChainCallback, useCollapsibleStyle, useScrollHandlerY, useSharedAnimatedRef, useTabNameContext, useTabsContext, useUpdateScrollViewContentSize } from './hooks';

/**
 * Used as a memo to prevent rerendering too often when the context changes.
 * See: https://github.com/facebook/react/issues/15156#issuecomment-474590693
 */
import { jsx as _jsx } from "react/jsx-runtime";
let AnimatedLegendList = null;
const ensureLegendList = () => {
  if (AnimatedLegendList) {
    return;
  }
  try {
    const legendListModule = require('@legendapp/list/reanimated');
    AnimatedLegendList = legendListModule.AnimatedLegendList;
  } catch {
    console.error('The optional dependency @legendapp/list is not installed. Please install it to use the LegendList component.');
  }
};
const LegendListMemo = /*#__PURE__*/React.memo(/*#__PURE__*/React.forwardRef(function (props, ref) {
  ensureLegendList();
  return AnimatedLegendList ? /*#__PURE__*/_jsx(AnimatedLegendList, {
    ...props,
    ref: ref
  }) : null;
}));
function LegendListImpl({
  style,
  onContentSizeChange,
  refreshControl,
  contentContainerStyle: _contentContainerStyle,
  ...rest
}, passRef) {
  const name = useTabNameContext();
  const {
    setRef,
    contentInset
  } = useTabsContext();
  const ref = useSharedAnimatedRef(passRef);
  const {
    scrollHandler,
    enable
  } = useScrollHandlerY(name);
  const hadLoad = useSharedValue(false);

  // LegendList doesn't have onLoad, but we'll keep the initialization pattern
  React.useEffect(() => {
    // Enable scroll handler after first render
    setTimeout(() => {
      hadLoad.value = true;
    }, 0);
  }, [hadLoad]);
  useAnimatedReaction(() => {
    return hadLoad.value;
  }, ready => {
    if (ready) {
      enable(true);
    }
  });
  const {
    progressViewOffset,
    contentContainerStyle
  } = useCollapsibleStyle();
  React.useEffect(() => {
    setRef(name, ref);
  }, [name, ref, setRef]);
  const scrollContentSizeChange = useUpdateScrollViewContentSize({
    name
  });
  const scrollContentSizeChangeHandlers = useChainCallback(React.useMemo(() => [scrollContentSizeChange, onContentSizeChange], [onContentSizeChange, scrollContentSizeChange]));
  const memoRefreshControl = React.useMemo(() => refreshControl && /*#__PURE__*/React.cloneElement(refreshControl, {
    progressViewOffset,
    ...refreshControl.props
  }), [progressViewOffset, refreshControl]);

  // Note: LegendList might not support contentInset and contentOffset directly
  const topInset = contentInset;
  const memoContentContainerStyle = React.useMemo(() => {
    const basePadding = contentContainerStyle?.paddingTop || 0;
    return {
      paddingTop: basePadding + topInset,
      ...(typeof _contentContainerStyle === 'object' ? _contentContainerStyle : {})
    };
  }, [_contentContainerStyle, contentContainerStyle?.paddingTop, topInset]);
  return /*#__PURE__*/_jsx(LegendListMemo, {
    ...rest,
    ref: ref,
    contentContainerStyle: memoContentContainerStyle,
    progressViewOffset: progressViewOffset,
    bouncesZoom: false,
    onScroll: scrollHandler,
    refreshControl: memoRefreshControl,
    automaticallyAdjustContentInsets: false,
    onContentSizeChange: scrollContentSizeChangeHandlers
  });
}

/**
 * Use like a regular LegendList.
 */
export const LegendList = /*#__PURE__*/React.forwardRef(LegendListImpl);
//# sourceMappingURL=LegendList.js.map