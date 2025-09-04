// shims/tslib.js
"use strict";

// Minimal helpers many libs expect from "tslib"
function __extends(d, b) {
  for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  function __() { this.constructor = d; }
  __.prototype = b === null ? Object.create(b) : b.prototype;
  d.prototype = b === null ? Object.create(b) : new __();
}
var __assign = Object.assign || function (t) {
  for (var i = 1; i < arguments.length; i++) {
    var s = arguments[i];
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
  }
  return t;
};
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s && Object.getOwnPropertySymbols) {
    var syms = Object.getOwnPropertySymbols(s);
    for (var i = 0; i < syms.length; i++) {
      var sym = syms[i];
      if (e.indexOf(sym) < 0 && Object.prototype.propertyIsEnumerable.call(s, sym)) t[sym] = s[sym];
    }
  }
  return t;
}

module.exports = { __extends, __assign, __rest };
