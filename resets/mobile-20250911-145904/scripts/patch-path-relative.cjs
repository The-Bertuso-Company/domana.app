const path = require("path");
const _relative = path.relative;
// Guard the "to" argument so Metro's serializer can't crash on undefined
path.relative = function(from, to) {
  if (typeof to !== "string") to = "";
  try { return _relative.call(this, from, to); }
  catch { return ""; }
};
