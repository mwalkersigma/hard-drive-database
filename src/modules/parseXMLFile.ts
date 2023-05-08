import jsonFormatter from "./xmljsonFormatter";

export default function parseXMLFile (file:any) {
    let converted = JSON.parse(jsonFormatter(file));
    delete converted._declaration
    let json = jsonFormatter(converted);
    return JSON.stringify(json,null,2);
}