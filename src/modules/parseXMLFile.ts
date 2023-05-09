import jsonFormatter from "./xmljsonFormatter";
import convert from "xml-js";
export default function parseXMLFile (file:any) {
    let outputStream = convert.xml2json(file,{spaces:2,compact:true,ignoreComment:true,ignoreDoctype:true});
    let parsedStream = JSON.parse(outputStream);
    delete parsedStream._declaration;
    return jsonFormatter(parsedStream);
}