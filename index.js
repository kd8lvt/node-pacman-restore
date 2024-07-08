import arghandler from "./arghandler.js";
import fs from "fs";
import {log,applyDefaults} from "./kdutils.js";
import {sync,remove,saveConfig,refresh} from "./pacmanwrapper.js";
let config;
try {
  config = JSON.parse(fs.readFileSync('config.json',"utf-8"));
} catch(e) {
  config = {};
  config = applyDefaults(config,[{key:"installed",value:[]}]);
  saveConfig(config);
}

const handlers = [
  {argument:"--dry",aliases:["-d"],contextFlags:{dry:true}},
  {argument:"--sync",aliases:["sync","s","-s"],params:["package"],contextFlags:{sync:true,package:"%package%"}},
  {argument:"--remove",aliases:["remove","r","-r"],params:["package"],contextFlags:{remove:true,package:"%package%"}},
  {argument:"--refresh",aliases:["refresh","R","-R"],contextFlags:{refresh:true}},
  {argument:"--verbose",aliases:["-v","v","verbose"],contextFlags:{verbose:true}}
]

let args = process.argv;
args.splice(0,2) //Trim non-user args
const context = arghandler(args,handlers);
function go(context) {
  if (context.sync) {
    if (config.installed.includes(context.package)) return console.log(`"${context.package}" should already be installed!`)
    sync(context);
    config.installed.push(context.package)
    saveConfig(config);
  } else if (context.remove) {
    if (!config.installed.includes(context.package)) return console.log(`"${context.package}" isn't installed yet!`);
    remove(context);
    if (config.installed.indexOf(context.package) > -1) {
      config.installed.splice(config.installed.indexOf(context.package,1));
    }
    saveConfig(config);
  } else if (context.refresh) refresh(config,context);
  else log(context,false,'Please specify an operation!');
}

go(context);