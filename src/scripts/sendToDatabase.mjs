// get params from command line
const params = process.argv.slice(2);
const [file] = params;
import fs from 'fs';
import fetch from "node-fetch";

fs.readFile(file, 'utf8', (err, data) => {
    //send http POST request to database
    // if process.env dev send to local host
    fetch(`http:/10.1.19.192:3002/api/addHardDrive?name=${file}&company_name=sigma`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml'
        },
        body: data
    })
        .then((res)=>{console.log(res)})
        .catch(err=>{
            console.error(err)
            throw new Error(err)
        })
})

/*
using this command from the command line
# This path is path to xml folder
for f in /Users/mwalker/Desktop/XML/*(.)
do
# this path is to the scripts folder in hard-drive-database
node /Users/mwalker/Desktop/hard-drive-database/src/scripts/sendToDatabase.mjs $f
done

 */
