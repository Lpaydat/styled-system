"use strict";

exports.__esModule = true;
exports.ResetButton = exports.ThemeControls = exports.FieldSet = exports.Field = exports.EditProvider = exports.EditContext = void 0;

var _core = require("@emotion/core");

var _react = _interopRequireWildcard(require("react"));

var _lodash = _interopRequireDefault(require("lodash.merge"));

var _lodash2 = _interopRequireDefault(require("lodash.omit"));

var _lodash3 = _interopRequireDefault(require("lodash.get"));

var _lodash4 = _interopRequireDefault(require("lodash.set"));

var _color = _interopRequireDefault(require("color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var EditContext = _react["default"].createContext({}); // not actually a reducer


exports.EditContext = EditContext;

var notAReducer = function notAReducer(state, next) {
  return typeof next === 'function' ? next(state) : (0, _lodash["default"])({}, state, next);
};

var EditProvider = function EditProvider(_ref) {
  var initialTheme = _ref.initialTheme,
      _ref$ignore = _ref.ignore,
      ignore = _ref$ignore === void 0 ? ['styles'] : _ref$ignore,
      children = _ref.children;
  var theme = (0, _react.useContext)(_core.ThemeContext) || initialTheme;

  var _useReducer = (0, _react.useReducer)(notAReducer, theme),
      state = _useReducer[0],
      setState = _useReducer[1];

  var context = {
    ignore: ignore,
    state: state,
    setState: setState,
    reset: function reset() {
      setState(theme);
    }
  };
  return (0, _core.jsx)(EditContext.Provider, {
    value: context
  }, (0, _core.jsx)(_core.ThemeContext.Provider, {
    value: state
  }, children));
}; // context-aware field


exports.EditProvider = EditProvider;

var Input = function Input(props) {
  return (0, _core.jsx)("input", _extends({}, props, {
    css: {
      width: '100%',
      margin: 0
    }
  }));
};

var Select = function Select(_ref2) {
  var _ref2$options = _ref2.options,
      options = _ref2$options === void 0 ? [] : _ref2$options,
      props = _objectWithoutPropertiesLoose(_ref2, ["options"]);

  return (0, _core.jsx)("select", _extends({}, props, {
    css: {
      width: '100%',
      margin: 0
    }
  }), options.map(function (option) {
    return (0, _core.jsx)("option", {
      key: option
    }, option);
  }));
};

var ColorInput = function ColorInput(props) {
  return (0, _core.jsx)(_react["default"].Fragment, null, (0, _core.jsx)("input", _extends({
    type: "color"
  }, props, {
    value: toHex(props.value),
    onChange: function onChange(e) {
      var next = (0, _lodash["default"])({}, e, {
        target: {
          value: toHex(e.target.value)
        }
      });
      props.onChange(next);
    },
    css: {
      flex: 'none',
      minWidth: 0,
      appearance: 'none',
      margin: 0,
      width: 32,
      height: 24,
      border: 0,
      backgroundColor: 'transparent'
    }
  })), (0, _core.jsx)(Input, _extends({}, props, {
    css: {}
  })));
};

var Field = function Field(_ref3) {
  var name = _ref3.name,
      type = _ref3.type,
      options = _ref3.options,
      render = _ref3.render,
      props = _objectWithoutPropertiesLoose(_ref3, ["name", "type", "options", "render"]);

  var context = (0, _react.useContext)(EditContext);
  var value = (0, _lodash3["default"])(context.state, name);

  var onChange = function onChange(e) {
    context.setState((0, _lodash4["default"])({}, name, e.target.value));
  };

  if (typeof render === 'function') {
    return render(_extends({
      name: name,
      type: type,
      options: options,
      value: value,
      onChange: onChange
    }, context));
  }

  var inputProps = _extends({
    name: name,
    value: value,
    onChange: onChange
  }, props);

  var field = (0, _core.jsx)(Input, inputProps);

  switch (type) {
    case 'number':
      field = (0, _core.jsx)(Input, _extends({
        type: "number"
      }, inputProps));
      break;

    case 'select':
      field = (0, _core.jsx)(Select, _extends({}, inputProps, {
        options: options
      }));
      break;

    case 'color':
      field = (0, _core.jsx)(ColorInput, inputProps);
      break;
  }

  return (0, _core.jsx)("label", {
    css: {
      display: 'flex',
      maxWidth: 512
    }
  }, (0, _core.jsx)("div", {
    css: {
      width: '65%'
    }
  }, name), (0, _core.jsx)("div", {
    css: {
      display: 'flex',
      width: '35%'
    }
  }, field));
};

exports.Field = Field;

var toHex = function toHex(n) {
  try {
    return (0, _color["default"])(n).hex();
  } catch (e) {
    return n;
  }
};

var FieldSet = function FieldSet(_ref4) {
  var name = _ref4.name,
      type = _ref4.type,
      _ref4$ignore = _ref4.ignore,
      ignore = _ref4$ignore === void 0 ? [] : _ref4$ignore,
      props = _objectWithoutPropertiesLoose(_ref4, ["name", "type", "ignore"]);

  var context = (0, _react.useContext)(EditContext);
  var value = (0, _lodash3["default"])(context.state, name);
  return (0, _core.jsx)("div", null, (0, _core.jsx)("h3", {
    css: {
      marginTop: 0,
      marginBottom: 0
    }
  }, name), Object.keys((0, _lodash2["default"])(value, ignore)).map(function (key) {
    var val = value[key];

    if (val && typeof val === 'object') {
      return (0, _core.jsx)(FieldSet, _extends({}, props, {
        name: name + "." + key,
        type: type,
        ignore: ignore
      }));
    }

    return (0, _core.jsx)(Field, _extends({}, props, {
      name: name + "." + key,
      type: type
    }));
  }));
};

exports.FieldSet = FieldSet;

var getType = function getType(key, value) {
  switch (key) {
    case 'colors':
      return 'color';

    case 'space':
    case 'fontSizes':
      return 'number';

    default:
      return;
  }
};

var ThemeControls = function ThemeControls(_ref5) {
  var ignore = _ref5.ignore,
      props = _objectWithoutPropertiesLoose(_ref5, ["ignore"]);

  var context = (0, _react.useContext)(EditContext);
  var keys = Object.keys((0, _lodash2["default"])(context.state, ignore || context.ignore));
  return (0, _core.jsx)("div", _extends({}, props, {
    css: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: 12,
      lineHeight: 1.5,
      color: '#000',
      backgroundColor: '#eee',
      maxWidth: 320,
      maxHeight: '100vh',
      padding: 8,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }
  }), keys.map(function (key) {
    return (0, _core.jsx)(FieldSet, _extends({
      key: key
    }, context, {
      name: key,
      type: getType(key)
    }));
  }));
};

exports.ThemeControls = ThemeControls;

var ResetButton = function ResetButton(props) {
  var _useContext = (0, _react.useContext)(EditContext),
      reset = _useContext.reset;

  return (0, _core.jsx)("button", _extends({}, props, {
    onClick: reset
  }));
};

exports.ResetButton = ResetButton;