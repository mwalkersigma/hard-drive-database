import { promises,readFile } from 'fs';
const { readdir } = promises;
import fetch from 'node-fetch';

let maxSends = 200;
let i = 0;
(async () => {
    const files = await readdir("../../XML",{withFileTypes: true});
    for (const file of files) {
        if (i < maxSends) {
            await readFile(`../../XML/${file.name}`, 'utf8', async function (err, data) {
                let dbEndpoint = "http://localhost:3000/api/addHardDrive";
                let searchParams = new URLSearchParams();
                searchParams.append("name", file);
                searchParams.append("company_name", "sigma");
                let url = dbEndpoint + "?" + searchParams.toString();
                const res = await fetch(url,{method: "POST",headers: {"Content-Type": "application/xml",},body: data,});
                console.log(`
            Status of request: ${res.status} 
            ${res.statusText}
            `)
            })
            i++
        }else{
            break;
        }
    }
})();