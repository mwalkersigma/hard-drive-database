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

/*
using this command from the command line
# This path is path to xml folder
for f in /Users/michaelwalker/Desktop/XML/*(.)
do
# this path is to the scripts folder in hard-drive-database
node /Users/michaelwalker/Desktop/hard-drive-database/src/scripts/sendToDatabase.mjs $f
done

 */
