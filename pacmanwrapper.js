import {exec} from "child_process";
import fs from "fs";
import {log} from "./kdutils.js";

export function sync(context) {
  log(context,false,"Installing something...");
  let command = `pacman --noconfirm${context.dry?" -p":""} -Syu ${context.package}`;
  run(command,context);
}

export function remove(context) {
  log(context,false,"Removing something...");
  let command = `pacman --noconfirm -Ru ${context.package}`
  run(command,context);
}

function run(cmd="",context) {
  if (context.dry) {
    let beginning = "pacman";
    let end = cmd.substring(7);
    cmd = beginning+" --print "+end;
  }
  log(context,true,cmd);
  let child = exec(cmd);
  if (context.verbose) {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    process.stdin.pipe(child.stdin);
  }
  return child;
}

export function saveConfig(config) {
  fs.writeFileSync("config.json",JSON.stringify(config,'',2));
}

export function refresh(config,context) {
  log(context,true,config)
  log(context,false,"Checking package list...");
  let child = run("pacman -Qs ",{})
  let curInstalled = [];
  child.stdout.addListener('data',(d)=>{
    let msg = d.toString();
    let lines = msg.split("\n");
    for (let line of lines) {
      if (!line.includes("local/")) continue;
      let pkgName = line.split("local/")[1].split(" ")[0];
      curInstalled.push(pkgName);
    }
  });
  child.addListener('exit',()=>{
    log(context,true,curInstalled)
    let allPresent = true;
    let pkgList = "";
    for (let pkg of config.installed) {
      log(context,true,`${pkg} is ${curInstalled.includes(pkg)?'':'not'} installed!`);
      if (!curInstalled.includes(pkg)) {
        pkgList += ` ${pkg}`;
        allPresent = false;
      }
    }
    if (allPresent) return;
    log(context,false,`Installing the following packages that have been removed since last run: ${pkgList}`);
    let command = `pacman -Syu${pkgList}`;
    run(command,{dry:false});
  })
}