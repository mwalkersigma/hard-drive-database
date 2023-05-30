import {Container, Button, Form, InputGroup, DropdownButton,Dropdown} from "react-bootstrap"
import {useState} from "react";
import HardDriveDataDisplay from "../hardDriveDataDisplay";
import SmartAttributesTable from "../smartAttributesTable";
import TaskDisplay from "../taskDisplay";
import jsConvert from "js-convert-case";

const searchableFields = [
    fieldFactory("serial_number", "device")
]
function fieldFactory(field,table){
    return {field,table}
}
export default function HardDriveSearch() {
    // internal state
    const [resultsVisible,setResultsVisible] = useState(false);
    const [userSearchString,setUserSearchString] = useState("");
    const [hardDriveData,setHardDriveData] = useState({});
    const [searchBy,setSearchBy] = useState("serial_number");
    function chooseTable (field){
        let table = searchableFields.find((searchableField) => searchableField.field === field);
        if(!table)return false;
        return table.table;
    }

    function buildURL () {
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

    const fetchFromServer = async () => {
        let URL = buildURL();
        if(!URL)return {status:false,msg:"improper search params"};
        const responseFromServer = await fetch(URL);
        if(!responseFromServer)return {status:false,msg:"Serial Number not found"};
        const serverJson = await responseFromServer.json();
        if(typeof serverJson !== "string")return {status:false,msg:"Serial Number not found"};
        let parsedJson = JSON.parse(serverJson);
        // if no results were found
        if(parsedJson.length === 0)return {status:false,msg:"Serial Number not found"};
        setHardDriveData(parsedJson);
        return {status:true};
    };
    function eventHandler (e){
        let enterWasPressed = e.type === "keydown" && e.key === "Enter";
        let submitWasClicked = e.type === "click"
        if(enterWasPressed || submitWasClicked){
            e.preventDefault(e);
            fetchFromServer()
                .then(({status,message}) => {
                    setResultsVisible(status)
                    if(!status)alert(message);
                })
        }

    }
    return (
        <>
            <Container >
                <br/>
                <Form.Label>Scan or Enter {jsConvert.toHeaderCase(searchBy)}</Form.Label>
                <InputGroup>
                    <Form.Control onKeyDown={eventHandler} type="text" placeholder="X4LTT0DAT" onInput={(e)=>setUserSearchString(e.target["value"].toUpperCase())} />
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
            </Container>
            <hr/>
            {resultsVisible &&
                <HardDriveDataDisplay hardDrive={hardDriveData}>
                    <SmartAttributesTable hardDrive={hardDriveData} />
                </HardDriveDataDisplay>}
            {resultsVisible && hardDriveData.tasks.length > 0 && <h1 className={"px-5 pb-5 h1"}>TASKS</h1>}
            {resultsVisible && hardDriveData.tasks.length > 0 && <TaskDisplay tasks={hardDriveData.tasks}/>}
            <br/>
            <br/>
            <br/>
        </>
    )

}