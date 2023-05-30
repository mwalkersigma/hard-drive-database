import Container from "react-bootstrap/Container";
import {Button,  Form, Table} from "react-bootstrap";
import HardDriveDataDisplay from "../components/hardDriveDataDisplay";
import {useState} from "react";
import TaskDisplay from "../components/taskDisplay";
import SmartAttributesTable from "../components/smartAttributesTable";

function SearchHardDrives() {
    const [resultsVisible,setResultsVisible] = useState(false);
    const [hardDrive,setHardDrive] = useState({})
    const [userSearch,setUserSearch] = useState("")

    const getSomeData = async ()=> {
        // get the host name from process.env
        let hostname,port;
        if(typeof window !== 'undefined') {
            hostname = window.location.hostname;
            port = window.location.port;
        }
        let searchURL = `http://${hostname}:${port}/api/getHardDriveBySerial?serial_number=${userSearch}`;
        const res = await fetch(searchURL);
        if(!res)return false;
        const data = await res.json();
        if(JSON.parse(data).length === 0)return false;
        setHardDrive(JSON.parse(data));
        return true;
    }

    function searchHandler(e){
        e.preventDefault();
        getSomeData()
            .then((status)=>{
                setResultsVisible(status);
            });
    }
    function handleKeyDown (e){
        if (e.key === 'Enter') {
            searchHandler(e)
        }
    }

    return (
        <>
            <Container >
                <br/>
                <Form.Group>
                    <Form.Label>Scan or Enter Serial Number</Form.Label>
                    <Form.Control onKeyDown={handleKeyDown} type="text" placeholder="X4LTT0DAT" onInput={(e)=>setUserSearch(e.target["value"].toUpperCase())} />
                </Form.Group>
                <Form.Group>
                    <br/>
                    <Button  onClick={searchHandler}> Search </Button>
                </Form.Group>
            </Container>
            <hr/>
            {resultsVisible &&
                <HardDriveDataDisplay hardDrive={hardDrive}>
                    <SmartAttributesTable hardDrive={hardDrive} />
                </HardDriveDataDisplay>}
            {resultsVisible && hardDrive.tasks.length > 0 && <h1 className={"px-5 pb-5 h1"}>TASKS</h1>}
            {resultsVisible && hardDrive.tasks.length > 0 && <TaskDisplay tasks={hardDrive.tasks}/>}
            <br/>
            <br/>
            <br/>

        </>

    );
}

export default SearchHardDrives;
