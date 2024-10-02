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
  return new Promise((resolve2, reject) => {
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
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  send: () => send
});
module.exports = __toCommonJS(src_exports);

// src/send.ts
var import_node_fs = __toESM(require("fs"));
var import_promises2 = __toESM(require("fs/promises"));
var import_node_path2 = __toESM(require("path"));
var import_path = require("path");
var import_http_errors = __toESM(require("http-errors"));

// src/send.utils.ts
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

// src/send.ts
function send(_0, _1) {
  return __async(this, arguments, function* (ctx, filePath, opts = {}) {
    if (!ctx)
      throw new Error("koa context required");
    if (!filePath)
      throw new Error("file pathname required");
    const root = opts.root ? import_node_path2.default.resolve(opts.root) : "";
    const trailingSlash = filePath.at(-1) === "/";
    filePath = filePath.slice(import_node_path2.default.parse(filePath).root.length);
    const { index } = opts;
    const maxage = opts.maxage || opts.maxAge || 0;
    const immutable = opts.immutable || false;
    const hidden = opts.hidden || false;
    const format = opts.format !== false;
    const extensions = Array.isArray(opts.extensions) ? opts.extensions : false;
    const brotli = opts.brotli !== false;
    const gzip = opts.gzip !== false;
    const { setHeaders } = opts;
    if (setHeaders && typeof setHeaders !== "function")
      throw new TypeError("option setHeaders must be function");
    try {
      filePath = decodeURIComponent(filePath);
    } catch (e) {
      return ctx.throw(400, "failed to decode");
    }
    if (index && trailingSlash)
      filePath += index;
    filePath = (0, import_path.normalize)((0, import_path.join)((0, import_path.resolve)(root), filePath));
    if (!hidden && isPathHidden(root, filePath))
      return;
    let encodingExt = "";
    if (ctx.acceptsEncodings("br", "identity") === "br" && brotli && (yield isPathExists(filePath + ".br"))) {
      filePath += ".br";
      ctx.set("Content-Encoding", "br");
      ctx.res.removeHeader("Content-Length");
      encodingExt = ".br";
    } else if (ctx.acceptsEncodings("gzip", "identity") === "gzip" && gzip && (yield isPathExists(filePath + ".gz"))) {
      filePath += ".gz";
      ctx.set("Content-Encoding", "gzip");
      ctx.res.removeHeader("Content-Length");
      encodingExt = ".gz";
    }
    if (extensions && !import_node_path2.default.basename(filePath).includes(".")) {
      for (let ext of extensions) {
        if (typeof ext !== "string")
          throw new TypeError(
            "option extensions must be array of strings or false"
          );
        if (!ext.startsWith("."))
          ext = `.${ext}`;
        if (yield isPathExists(`${filePath}${ext}`)) {
          filePath = `${filePath}${ext}`;
          break;
        }
      }
    }
    let stats;
    try {
      stats = yield import_promises2.default.stat(filePath);
      if (stats.isDirectory()) {
        if (!format || !index)
          return;
        filePath += `/${index}`;
        stats = yield import_promises2.default.stat(filePath);
      }
    } catch (err) {
      const notfound = ["ENOENT", "ENAMETOOLONG", "ENOTDIR"];
      if (notfound.includes(err.code))
        throw (0, import_http_errors.default)(404, err);
      err.status = 500;
      throw err;
    }
    setHeaders == null ? void 0 : setHeaders(ctx.res, filePath, stats);
    ctx.set("Content-Length", stats.size.toString());
    if (!ctx.response.get("Last-Modified"))
      ctx.set("Last-Modified", stats.mtime.toUTCString());
    if (!ctx.response.get("Cache-Control")) {
      const directives = [`max-age=${maxage / 1e3 | 0}`];
      if (immutable)
        directives.push("immutable");
      ctx.set("Cache-Control", directives.join(","));
    }
    if (!ctx.type)
      ctx.type = getFileType(filePath, encodingExt);
    ctx.body = import_node_fs.default.createReadStream(filePath);
    return filePath;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  send
});
