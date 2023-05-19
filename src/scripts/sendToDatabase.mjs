// get params from command line
const params = process.argv.slice(2);
const [file] = params;
import fs from 'fs';
import fetch from "node-fetch";

fs.readFile(file, 'utf8', (err, data) => {
    //send http POST request to database
    // if process.env dev send to local host
    let host = process.env.NODE_ENV === "development" ? "localhost:3000" : "10.1.19.192:3000"
    console.log(file);
    fetch(`http://localhost:3001`, {
        method: 'GET',
        //headers: {'Content-Type': 'application/xml'},
        //body: data
    })
        .then((res)=>{console.log(res)})
        .catch(err=>console.log(err))
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
