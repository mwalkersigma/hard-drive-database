import Container from "react-bootstrap/Container";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useState} from "react";

function HardDriveDataDisplay ({hardDrive}) {
    console.log(hardDrive)
    return (
        hardDrive &&
        <Form className={"p-5"}>
            {hardDrive && Object.entries(hardDrive).map(([key,value],index)=>{
                return (
                    <>
                        <Form.Label style={{padding:"0 0 0 2%"}} className={"h1 text-xxl-center"}>{key.toUpperCase()}</Form.Label>
                        <br/>
                        <Row key={index}>
                            {Object.entries(value).map(([k,v],i)=>{
                                return (
                                    <Form.Group key={i} as={Col} controlId="formGridCity">
                                        <Form.Label>{k}</Form.Label>
                                        <Form.Control readOnly disabled value={v}/>
                                    </Form.Group>
                                )
                            })
                            }
                        </Row>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </>
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
        const res = await fetch(`http://localhost:3000/api/getHardDriveBySerial?serial_number=${userSearch}`);
        const data = await res.json();
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
                            .then(data=>{
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