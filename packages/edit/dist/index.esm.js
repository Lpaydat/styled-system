function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/** @jsx jsx */
import { jsx, ThemeContext } from '@emotion/core';
import React, { useReducer, useContext } from 'react';
import merge from 'lodash.merge';
import omit from 'lodash.omit';
import get from 'lodash.get';
import set from 'lodash.set';
import Color from 'color';
export var EditContext = React.createContext({}); // not actually a reducer

var notAReducer = function notAReducer(state, next) {
  return typeof next === 'function' ? next(state) : merge({}, state, next);
};

export var EditProvider = function EditProvider(_ref) {
  var initialTheme = _ref.initialTheme,
      _ref$ignore = _ref.ignore,
      ignore = _ref$ignore === void 0 ? ['styles'] : _ref$ignore,
      children = _ref.children;
  var theme = useContext(ThemeContext) || initialTheme;

  var _useReducer = useReducer(notAReducer, theme),
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
  return jsx(EditContext.Provider, {
    value: context
  }, jsx(ThemeContext.Provider, {
    value: state
  }, children));
}; // context-aware field

var Input = function Input(props) {
  return jsx("input", _extends({}, props, {
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

  return jsx("select", _extends({}, props, {
    css: {
      width: '100%',
      margin: 0
    }
  }), options.map(function (option) {
    return jsx("option", {
      key: option
    }, option);
  }));
};

var ColorInput = function ColorInput(props) {
  return jsx(React.Fragment, null, jsx("input", _extends({
    type: "color"
  }, props, {
    value: toHex(props.value),
    onChange: function onChange(e) {
      var next = merge({}, e, {
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
  })), jsx(Input, _extends({}, props, {
    css: {}
  })));
};

export var Field = function Field(_ref3) {
  var name = _ref3.name,
      type = _ref3.type,
      options = _ref3.options,
      render = _ref3.render,
      props = _objectWithoutPropertiesLoose(_ref3, ["name", "type", "options", "render"]);

  var context = useContext(EditContext);
  var value = get(context.state, name);

  var onChange = function onChange(e) {
    context.setState(set({}, name, e.target.value));
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

  var field = jsx(Input, inputProps);

  switch (type) {
    case 'number':
      field = jsx(Input, _extends({
        type: "number"
      }, inputProps));
      break;

    case 'select':
      field = jsx(Select, _extends({}, inputProps, {
        options: options
      }));
      break;

    case 'color':
      field = jsx(ColorInput, inputProps);
      break;
  }

  return jsx("label", {
    css: {
      display: 'flex',
      maxWidth: 512
    }
  }, jsx("div", {
    css: {
      width: '65%'
    }
  }, name), jsx("div", {
    css: {
      display: 'flex',
      width: '35%'
    }
  }, field));
};

var toHex = function toHex(n) {
  try {
    return Color(n).hex();
  } catch (e) {
    return n;
  }
};

export var FieldSet = function FieldSet(_ref4) {
  var name = _ref4.name,
      type = _ref4.type,
      _ref4$ignore = _ref4.ignore,
      ignore = _ref4$ignore === void 0 ? [] : _ref4$ignore,
      props = _objectWithoutPropertiesLoose(_ref4, ["name", "type", "ignore"]);

  var context = useContext(EditContext);
  var value = get(context.state, name);
  return jsx("div", null, jsx("h3", {
    css: {
      marginTop: 0,
      marginBottom: 0
    }
  }, name), Object.keys(omit(value, ignore)).map(function (key) {
    var val = value[key];

    if (val && typeof val === 'object') {
      return jsx(FieldSet, _extends({}, props, {
        name: name + "." + key,
        type: type,
        ignore: ignore
      }));
    }

    return jsx(Field, _extends({}, props, {
      name: name + "." + key,
      type: type
    }));
  }));
};

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

export var ThemeControls = function ThemeControls(_ref5) {
  var ignore = _ref5.ignore,
      props = _objectWithoutPropertiesLoose(_ref5, ["ignore"]);

  var context = useContext(EditContext);
  var keys = Object.keys(omit(context.state, ignore || context.ignore));
  return jsx("div", _extends({}, props, {
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
    return jsx(FieldSet, _extends({
      key: key
    }, context, {
      name: key,
      type: getType(key)
    }));
  }));
};
export var ResetButton = function ResetButton(props) {
  var _useContext = useContext(EditContext),
      reset = _useContext.reset;

  return jsx("button", _extends({}, props, {
    onClick: reset
  }));
};
