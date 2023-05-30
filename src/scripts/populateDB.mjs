import { promises,readFile } from 'fs';
const { readdir } = promises;
import fetch from 'node-fetch';
const serverCoreUrl = process.argv.slice(2);
const pathToXML = process.argv.slice(3);
let maxSends = 200;
import Logger from "../modules/logger";
const logger = new Logger();
let i = 0;
(async () => {
    const files = await readdir(`${pathToXML}`,{withFileTypes: true});
    for (const file of files) {
        if (i < maxSends) {
            await readFile(`${pathToXML}/${file.name}`, 'utf8', async function (err, data) {
                let dbEndpoint = `${serverCoreUrl}/api/addHardDrive`;
                let searchParams = new URLSearchParams();
                searchParams.append("name", file.name);
                searchParams.append("company_name", "n/a");
                let url = dbEndpoint + "?" + searchParams.toString();
                const res = await fetch(url,{method: "POST",headers: {"Content-Type": "application/xml",},body: data,});
                logger.log(`Starting File : ${file}`)
                logger.log(`Status of request: ${res.status} ${res.statusText}`)
            })
            i++
        }else{
            break;
        }
    }
})();