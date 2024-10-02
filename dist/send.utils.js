var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/send.utils.ts
var send_utils_exports = {};
__export(send_utils_exports, {
  getFileType: () => getFileType,
  isPathExists: () => isPathExists,
  isPathHidden: () => isPathHidden
});
module.exports = __toCommonJS(send_utils_exports);
var import_promises = __toESM(require("fs/promises"));
var import_node_path = __toESM(require("path"));
function isPathExists(targetPath) {
  return __async(this, null, function* () {
    try {
      yield import_promises.default.access(targetPath);
      return true;
    } catch (e) {
      return false;
    }
  });
}
function isPathHidden(root, targetPath) {
  const pathParts = targetPath.slice(root.length).split(import_node_path.default.sep);
  for (const part of pathParts) {
    if (part.at(0) === ".")
      return true;
  }
  return false;
}
function getFileType(file, ext) {
  if (ext !== "")
    return import_node_path.default.extname(import_node_path.default.basename(file, ext));
  return import_node_path.default.extname(file);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFileType,
  isPathExists,
  isPathHidden
});
