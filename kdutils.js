function recurse(obj,path,idx) { //Work your way down the path
  idx=idx||0;
  if (idx > path.length) return obj;
  if (obj[path[idx]] == null) return def;
  obj = obj[path[idx]];
  return recurse(obj,path,idx++);
}

export function getOrDefault(obj,key,def) {
  try {
    obj = JSON.parse(obj); //Ensure it's an actual JS object, not a JSON string.
  } catch(e) {};
  return obj[key]||def;
}

export function applyDefault(obj,key,value) {
  obj[key] = getOrDefault(obj,key,value);
}

export function applyDefaults(obj,keyvaluepairs) {
  for (let kvpair of keyvaluepairs) {
    applyDefault(obj,kvpair.key,kvpair.value);
  }
  return obj;
}

function _log(...message) {
  console.log(...message);
}

export function log(context,debug,...message) {
  if (!debug || (debug && context.verbose)) return _log(...message);
}