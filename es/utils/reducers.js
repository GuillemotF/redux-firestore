"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pathToArr = pathToArr;
exports.getSlashStrPath = getSlashStrPath;
exports.getDotStrPath = getDotStrPath;
exports.combineReducers = combineReducers;
exports.pathFromMeta = pathFromMeta;
exports.updateItemInArray = updateItemInArray;
exports.createReducer = createReducer;
exports.preserveValuesFromState = preserveValuesFromState;

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _trimStart2 = _interopRequireDefault(require("lodash/trimStart"));

var _replace2 = _interopRequireDefault(require("lodash/replace"));

var _pick2 = _interopRequireDefault(require("lodash/pick"));

var _isArray2 = _interopRequireDefault(require("lodash/isArray"));

var _isBoolean2 = _interopRequireDefault(require("lodash/isBoolean"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function pathToArr(path) {
  return path ? path.split(/\//).filter(function (p) {
    return !!p;
  }) : [];
}

function getSlashStrPath(path) {
  return (0, _trimStart2.default)((0, _replace2.default)(path, /[.]/g, '/'), '/');
}

function getDotStrPath(path) {
  return pathToArr(path).join('.');
}

function combineReducers(reducers) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments.length > 1 ? arguments[1] : undefined;
    return Object.keys(reducers).reduce(function (nextState, key) {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}

function pathFromMeta(meta) {
  if (!meta) {
    throw new Error('Action meta is required to build path for reducers.');
  }

  var collection = meta.collection,
      doc = meta.doc,
      subcollections = meta.subcollections,
      storeAs = meta.storeAs;

  if (storeAs) {
    return doc ? [storeAs, doc] : [storeAs];
  }

  if (meta.path) {
    return meta.path.split('/');
  }

  if (!collection) {
    throw new Error('Collection is required to construct reducer path.');
  }

  var basePath = [collection];

  if (doc) {
    basePath = [].concat(_toConsumableArray(basePath), [doc]);
  }

  if (!subcollections) {
    return basePath;
  }

  var mappedCollections = subcollections.map(pathFromMeta);
  return [].concat(_toConsumableArray(basePath), _toConsumableArray((0, _flatten2.default)(mappedCollections)));
}

function updateItemInArray(array, itemId, updateItemCallback) {
  var matchFound = false;
  var modified = array.map(function (item) {
    if (!item || item.id !== itemId) {
      return item;
    }

    matchFound = true;
    var updatedItem = updateItemCallback(item);
    return updatedItem;
  });

  if (!matchFound) {
    modified.push(updateItemCallback({
      id: itemId
    }));
  }

  return modified;
}

function createReducer(initialState, handlers) {
  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    }

    return state;
  };
}

function preserveValuesFromState(state, preserveSetting, nextState) {
  if ((0, _isBoolean2.default)(preserveSetting)) {
    return nextState ? _objectSpread({}, state, nextState) : state;
  }

  if ((0, _isFunction2.default)(preserveSetting)) {
    return preserveSetting(state, nextState);
  }

  if ((0, _isArray2.default)(preserveSetting)) {
    return (0, _pick2.default)(state, preserveSetting);
  }

  throw new Error('Invalid preserve parameter. It must be an Object or an Array.');
}