import path from "path";
import fs from "fs";
const getDirName = path.dirname;
export default class Logger {
    log=(message:string)=>{
        let sysPath = getDirName(__dirname).split(path.sep + ".next")[0];
        const sep = path.sep;
        let date = new Date().toLocaleDateString().split("/").join("-");
        let filePath = `${sysPath}${sep}src${sep}logs${sep}${date}-log.log`;
        let msg = `${message}\n`;
        let options = {flag:"a"};
        fs.writeFileSync(filePath,msg,options);
    }
}