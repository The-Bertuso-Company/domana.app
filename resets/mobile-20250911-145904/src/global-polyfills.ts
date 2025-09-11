// src/global-polyfills.ts
import "tslib";

/**
 * Minimal TS helper shims for older UMD bundles that reference `this.__extends`
 * before modules have a chance to define it. We define on globalThis so any
 * early-evaluated module can see them.
 */
(() => {
  const g: any = (typeof globalThis !== "undefined" ? globalThis : global) as any;

  if (!g.__extends) {
    g.__extends = function (d: any, b: any) {
      for (const p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      function __() { this.constructor = d; }
      __.prototype = b === null ? Object.create(b) : b.prototype;
      d.prototype = b === null ? Object.create(b) : new (__ as any)();
    };
  }

  if (!g.__assign) {
    g.__assign = Object.assign || function (t: any, ...sources: any[]) {
      for (const s of sources) for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      return t;
    };
  }

  if (!g.__rest) {
    g.__rest = function (s: any, e: (string | symbol)[]) {
      const t: any = {};
      for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
      if (Object.getOwnPropertySymbols) {
        for (const sym of Object.getOwnPropertySymbols(s)) {
          if (e.indexOf(sym) < 0 && (s as any).propertyIsEnumerable(sym)) t[sym] = s[sym];
        }
      }
      return t;
    };
  }
})();
