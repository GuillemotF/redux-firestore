"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduceReducers = _interopRequireDefault(require("reduce-reducers"));

var _reducers = require("./utils/reducers");

var _reducers2 = require("./reducers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combinedReducers = (0, _reducers.combineReducers)({
  status: _reducers2.statusReducer,
  data: _reducers2.dataReducer,
  ordered: _reducers2.orderedReducer,
  listeners: _reducers2.listenersReducer,
  errors: _reducers2.errorsReducer,
  queries: _reducers2.queriesReducer,
  composite: function composite(state) {
    return state;
  }
});

var _default = (0, _reduceReducers.default)(combinedReducers, _reducers2.crossSliceReducer);

exports.default = _default;