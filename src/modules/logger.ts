import path from "path";
import fs from "fs";
const getDirName = path.dirname;
export default class Logger {
    log=(message:string)=>{
        if(process.env.NODE_ENV === 'development'){
            let sysPath = getDirName(__dirname).split(path.sep + ".next")[0];
            const sep = path.sep;
            let filePath = `${sysPath}${sep}src${sep}logs${sep}log.log`;
            let msg = `${message}\n`;
            let options = {flag:"a"};
            fs.writeFileSync(filePath,msg,options);
        }else{
            // date in this format mm-dd-yyyy
            let date = new Date().toLocaleDateString().split("/").join("-");
            let sysPath = getDirName(__dirname).split(path.sep + ".next")[0];
            const sep = path.sep;
            let filePath = `${sysPath}${sep}src${sep}logs${sep}${date}-log.log`;
            let msg = `${message}\n`;
            let options = {flag:"a"};
            fs.writeFileSync(filePath,msg,options);
        }
    }
}