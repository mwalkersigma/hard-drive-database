import Container from "react-bootstrap/Container";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useState} from "react";

function HardDriveDataDisplay ({hardDrive}) {
    const itemsPerRow = 4;
    let rows = [];
    const formatted = {}
    let count = 0;
    Object.entries(hardDrive).forEach(([fieldKey,fieldValue])=>{
        let temp =[]
        Object.entries(fieldValue).forEach(([itemKey,itemValue])=>{
            temp.push({itemKey,itemValue})
            count++
            if(count===itemsPerRow){
                rows.push(temp);
                temp=[];
                count = 0;
            }
        })
        formatted[fieldKey]=rows;
        rows = [];
    })
    return (
        hardDrive &&
        <Form className={"p-5"}>
            {Object.entries(formatted).map(([fieldKey,fieldValue],index)=>{
                return (
                    <Form.Group className={"pb-5"} key={index}>
                        <Form.Label className={"h1 pb-3"}>{fieldKey.toUpperCase()}</Form.Label>
                        {fieldValue.map((rowItem,j)=>{
                            return (
                                <Row key={j}>
                                    {rowItem.map(({itemKey,itemValue},k)=>(
                                        <Form.Group key={k} as={Col} controlId="formGridManufacturer">
                                            <Form.Label>{itemKey}</Form.Label>
                                            <Form.Control readOnly disabled type="text" value={itemValue}/>
                                        </Form.Group>
                                    ))}
                                </Row>)}
                        )}
                    </Form.Group>
                )
            })}
        </Form>
    )
}



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
        const data = await res.json();
        if(data?.text==="Serial number not found"){
            alert("Serial number not found");
            return;
        }
        setHardDrive(JSON.parse(data));

    }

    return (
        <>
            <Container >
                <br/>
                <Form.Group>
                    <Form.Label>Scan or Enter Serial Number</Form.Label>
                    <Form.Control type="text" placeholder="X4LTT0DAT" onInput={(e)=>setUserSearch(e.target["value"])} />
                </Form.Group>
                <Form.Group>
                    <br/>
                    <Button onClick={()=> {
                        getSomeData()
                            .then(()=>{
                                setResultsVisible(true);
                            });
                    }}> Search </Button>
                </Form.Group>
            </Container>
            <br/>
            <br/>
            <hr/>
            {resultsVisible && <HardDriveDataDisplay hardDrive={hardDrive}/>}
        </>

    );
}

export default SearchHardDrives;
