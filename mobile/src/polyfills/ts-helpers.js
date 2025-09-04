(() => {
  var g = (typeof globalThis!=="undefined"&&globalThis)||(typeof global!=="undefined"&&global)||(typeof self!=="undefined"&&self)||{};
  if(!g.__extends){
    g.__extends=function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];function __(){this.constructor=d}__.prototype=b===null?Object.create(b):b.prototype;d.prototype=b===null?Object.create(b):new __()};
  }
  if(!g.__assign){
    var _assign = Object.assign && Object.assign.bind ? Object.assign.bind(Object) : null;
    g.__assign=_assign||function(t){for(var i=1;i<arguments.length;i++){var s=arguments[i];for(var p in s)if(Object.prototype.hasOwnProperty.call(s,p))t[p]=s[p]}return t};
  }
  if(!g.__rest){
    g.__rest=function(s,e){var t={};for(var p in s)if(Object.prototype.hasOwnProperty.call(s,p)&&e.indexOf(p)<0)t[p]=s[p];if(s!=null&&typeof Object.getOwnPropertySymbols==="function"){for(var i=0,p2=Object.getOwnPropertySymbols(s);i<p2.length;i++){if(e.indexOf(p2[i])<0&&Object.prototype.propertyIsEnumerable.call(s,p2[i]))t[p2[i]]=s[p2[i]]}}return t};
  }
})();
