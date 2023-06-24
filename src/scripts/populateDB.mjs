import { readFile, readdir } from 'fs/promises';
import fetch from 'node-fetch';
(async () => {
    const files = await readdir(`../../desktop/xml`,{withFileTypes: true});
    for (const file of files) {
        if(file.name.includes(".xml")) {
            let data = await readFile(`../../desktop/xml/${file.name}`, 'utf8');
            let dbEndpoint = `http://localhost:3000/api/addHardDrive`;
            let searchParams = new URLSearchParams();
            searchParams.append("name", file.name);
            searchParams.append("company_name", "n/a");
            let url = dbEndpoint + "?" + searchParams.toString();
            const res = await fetch(url, {
                method: "POST",
                body: data,
                headers: {"Content-Type": "application/xml"},
            });
            console.log(`Status of request: ${res.status} ${res.statusText}`)
            if(!res.ok) {
                console.log(`Error with file: ${file.name}`)
            }
            //console.log(`Starting File : ${file.name}`)

        }
    }
})();
