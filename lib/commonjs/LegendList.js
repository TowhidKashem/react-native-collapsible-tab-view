"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegendList = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNativeReanimated = require("react-native-reanimated");
var _hooks = require("./hooks");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Used as a memo to prevent rerendering too often when the context changes.
 * See: https://github.com/facebook/react/issues/15156#issuecomment-474590693
 */let AnimatedLegendList = null;
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
const LegendListMemo = /*#__PURE__*/_react.default.memo(/*#__PURE__*/_react.default.forwardRef(function (props, ref) {
  ensureLegendList();
  return AnimatedLegendList ? /*#__PURE__*/(0, _jsxRuntime.jsx)(AnimatedLegendList, {
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
  const name = (0, _hooks.useTabNameContext)();
  const {
    setRef,
    contentInset
  } = (0, _hooks.useTabsContext)();
  const ref = (0, _hooks.useSharedAnimatedRef)(passRef);
  const {
    scrollHandler,
    enable
  } = (0, _hooks.useScrollHandlerY)(name);
  const hadLoad = (0, _reactNativeReanimated.useSharedValue)(false);

  // LegendList doesn't have onLoad, but we'll keep the initialization pattern
  _react.default.useEffect(() => {
    // Enable scroll handler after first render
    setTimeout(() => {
      hadLoad.value = true;
    }, 0);
  }, [hadLoad]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
    return hadLoad.value;
  }, ready => {
    if (ready) {
      enable(true);
    }
  });
  const {
    progressViewOffset,
    contentContainerStyle
  } = (0, _hooks.useCollapsibleStyle)();
  _react.default.useEffect(() => {
    setRef(name, ref);
  }, [name, ref, setRef]);
  const scrollContentSizeChange = (0, _hooks.useUpdateScrollViewContentSize)({
    name
  });
  const scrollContentSizeChangeHandlers = (0, _hooks.useChainCallback)(_react.default.useMemo(() => [scrollContentSizeChange, onContentSizeChange], [onContentSizeChange, scrollContentSizeChange]));
  const memoRefreshControl = _react.default.useMemo(() => refreshControl && /*#__PURE__*/_react.default.cloneElement(refreshControl, {
    progressViewOffset,
    ...refreshControl.props
  }), [progressViewOffset, refreshControl]);

  // Note: LegendList might not support contentInset and contentOffset directly
  const topInset = contentInset;
  const memoContentContainerStyle = _react.default.useMemo(() => {
    const basePadding = contentContainerStyle?.paddingTop || 0;
    return {
      paddingTop: basePadding + topInset,
      ...(typeof _contentContainerStyle === 'object' ? _contentContainerStyle : {})
    };
  }, [_contentContainerStyle, contentContainerStyle?.paddingTop, topInset]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(LegendListMemo, {
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
const LegendList = exports.LegendList = /*#__PURE__*/_react.default.forwardRef(LegendListImpl);
//# sourceMappingURL=LegendList.js.map