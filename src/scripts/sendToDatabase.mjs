// get params from command line
const params = process.argv.slice(2);
const [file] = params;
import fs from 'fs';
import fetch from "node-fetch";

fs.readFile(file, 'utf8', (err, data) => {
    //send http POST request to database
    console.log(file);
    fetch(`http://localhost:3000/api/addHardDrive?name=${file}&company_name=sigma`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml'
        },
        body: data
    })
        .then(()=>{})
})
