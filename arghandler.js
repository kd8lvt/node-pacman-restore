function getParam(args,handler,argIdx,param) {
  if (args[argIdx].split("=").length == 2) {
    let params=args[argIdx].split("=")[1].split(",");
    for (let i in handler.params) if (i < params.length) if (handler.params[i]==param) return params[i];
  } else for (let i=argIdx;i<args.length;i++) {
    if (args[i].split("=").length == 2) {
      if (args[i].split("=")[0] == param) return args[i].split("=")[1];
    }
  }
  return null;
}

export default function(args,handlers) {
  let context = {};
  for (let argIdx in args) {
    let arg = args[argIdx];
    for (let handler of handlers) {
      if (arg.startsWith(handler.argument) || handler.aliases.flatMap((val)=>arg.startsWith(val)).includes(true)) {
        for (let key of Object.keys(handler.contextFlags)) if (handler.contextFlags.hasOwnProperty(key)) {
          context[key] = handler.contextFlags[key];
          if (handler.params) for (let param of handler.params) {
            let foundParam = getParam(args,handler,argIdx,param);
            if (foundParam == null) throw new Error(`Invalid usage of argument "${arg}": Expected parameter for "${param}"`)
            if (handler.params && foundParam != null && typeof context[key] == typeof "string") for (let param of handler.params) context[key] = context[key].replaceAll("%"+param+"%",foundParam);
          }
        }
      }
    }
  }
  return context;
}