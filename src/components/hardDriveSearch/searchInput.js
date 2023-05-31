import {useState} from "react";
import {Button, Container, Dropdown, DropdownButton, Form, InputGroup} from "react-bootstrap";
import jsConvert from "js-convert-case";

const searchableFields = [
    fieldFactory("serial_number", "device")
]
function fieldFactory(field,table){
    return {field,table}
}
function chooseTable (field){
    let table = searchableFields.find((searchableField) => searchableField.field === field);
    if(!table)return false;
    return table.table;
}
function buildURL (searchBy,userSearchString) {
    // takes the user input and builds a URL to fetch from
    let hostname,port;
    if(typeof window !== "undefined"){
        hostname = window.location.hostname;
        port = window.location.port;
    }
    // value , field , table are the search params
    let searchParams = new URLSearchParams();
    let table = chooseTable(searchBy);
    if(!table)return false;
    searchParams.append("value",userSearchString);
    searchParams.append("field",searchBy);
    searchParams.append("table",table);

    let browserPrefix = "http://";
    let address = hostname + ":" + port;
    let APIAddress = "/api/getHardDriveByField";
    return  browserPrefix + address + APIAddress + "?" + searchParams.toString();
}
export default function SearchInput ({setHardDriveData,setResultsVisible}) {
    const [userSearchString,setUserSearchString] = useState("");
    const [searchBy,setSearchBy] = useState("serial_number");
    const [searchResults,setSearchResults] = useState(undefined);
    function eventHandler (e){
        let enterWasPressed = e.type === "keydown" && e.key === "Enter";
        let submitWasClicked = e.type === "click"
        if(enterWasPressed || submitWasClicked){
            e.preventDefault(e);
            fetchFromServer()
                .then(result => {
                    return result;
                })
                .then(({status,msg}) => {
                    setResultsVisible(status)
                    if(!status)alert(msg);
                })
        }
    }

    const fetchFromServer = async () => {
        let URL = buildURL(searchBy,userSearchString);
        if(!URL)return {status:false,msg:"improper search params"};
        const responseFromServer = await fetch(URL);
        if(!responseFromServer)return {status:false,msg:"Serial Number not found"};
        const serverJson = await responseFromServer.json();
        if(typeof serverJson !== "string")return {status:false,msg:"Serial Number not found"};
        let parsedJson = JSON.parse(serverJson);
        if(!parsedJson?.resolvedPromises?.length)return {status:false,msg:"Serial Number not found"};
        setHardDriveData(parsedJson.resolvedPromises);
        setSearchResults(parsedJson.result)
        return {status:true};

    };
    console.log(searchResults )
    return (
        <Container >
            <br/>
            <Form.Label>Scan or Enter {jsConvert.toHeaderCase(searchBy)}</Form.Label>
            <InputGroup>
                <Form.Control
                    onKeyDown={eventHandler}
                    type="text"
                    placeholder="X4LTT0DAT"
                    onInput={(e)=>setUserSearchString(e.target["value"].toUpperCase())}
                />
                <DropdownButton title={jsConvert.toTextCase(searchBy)}>
                    {searchableFields.map(({field,table},index) => {
                        return <Dropdown.Item
                            key={index}
                            onClick={()=>setSearchBy(field)}>
                            {jsConvert.toTextCase(field)}
                        </Dropdown.Item>
                    })
                    }
                </DropdownButton>
                <Button  onClick={eventHandler}> Search </Button>
            </InputGroup>
            <br/>
            {searchResults && searchResults.foundWith !== "NaiveSearch" &&
               <em>
                   No exact match was found. <br/>
                   Showing results for : <strong>{searchResults.matchCandidate}</strong> ?
               </em> }
            <br/>
        </Container>
    )
}