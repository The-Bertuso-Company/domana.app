// Minimal TS helper shims for Hermes/strict-module envs.
// Loaded at app entry so any route/module can rely on them.

(() => {
  const g: any = globalThis as any;

  if (!g.__extends) {
    g.__extends = function (d: any, b: any) {
      for (const p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      function __() { this.constructor = d; }
      __.prototype = b === null ? Object.create(b) : b.prototype;
      d.prototype = b === null ? Object.create(b) : new (__ as any)();
    };
  }

  if (!g.__assign) {
    g.__assign = Object.assign || function (target: any, ...srcs: any[]) {
      for (const s of srcs) for (const k in s) if (Object.prototype.hasOwnProperty.call(s, k)) target[k] = s[k];
      return target;
    };
  }

  if (!g.__rest) {
    g.__rest = function (s: any, e: string[]) {
      const t: any = {};
      for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function") {
        for (const p of Object.getOwnPropertySymbols(s)) {
          if (e.indexOf(p as any) < 0 && Object.prototype.propertyIsEnumerable.call(s, p)) t[p as any] = s[p as any];
        }
      }
      return t;
    };
  }
})();
