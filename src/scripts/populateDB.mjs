import { promises,readFile } from 'fs';
const { readdir } = promises;
import fetch from 'node-fetch';
let consoleArgs = process.argv.slice(2);
const serverCoreUrl = consoleArgs[0]
const pathToXML = consoleArgs[1];
let maxSends = 200;
let i = 0;
(async () => {
    const files = await readdir(`${pathToXML}`,{withFileTypes: true});
    for (const file of files) {
            await readFile(`${pathToXML}/${file.name}`, 'utf8', async function (err, data) {
                let dbEndpoint = `${serverCoreUrl}/api/addHardDrive`;
                let searchParams = new URLSearchParams();
                searchParams.append("name", file.name);
                searchParams.append("company_name", "n/a");
                let url = dbEndpoint + "?" + searchParams.toString();
                const res = await fetch(url,{method: "POST",headers: {"Content-Type": "application/xml",},body: data,});
                console.log(`Starting File : ${file.name}`)
                console.log(`Status of request: ${res.status} ${res.statusText}`)
            })
            i++
    }
})();