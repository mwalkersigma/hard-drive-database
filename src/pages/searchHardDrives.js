import Container from "react-bootstrap/Container";
import {Accordion, Button, Col, Form, Row} from "react-bootstrap";
import {useState} from "react";
import {type} from "os";



function HardDriveDataDisplay ({hardDrive}) {
    const itemsPerRow = 4;
    let rows = [];
    const formatted = {}
    let count = 0;
    Object.entries(hardDrive).forEach(([fieldKey,fieldValue])=>{
        let temp =[]
        Object.entries(fieldValue).forEach(([itemKey, itemValue]) => {
            temp.push({itemKey, itemValue})
            count++
            if (count === itemsPerRow) {
                rows.push(temp);
                temp = [];
                count = 0;
            }
        })
        formatted[fieldKey] = rows;
        rows = [];
    })
    return (
        hardDrive &&
        <Form className={"p-5 pb-0"}>
            {Object.entries(formatted).map(([fieldKey,fieldValue],index)=>{
                    if (fieldKey !== "tasks"){
                        return (
                            <Form.Group className={"pb-5"} key={index}>
                                <Form.Label className={"h1 pb-3"}>{fieldKey.toUpperCase()}</Form.Label>
                                {fieldValue.map((rowItem, j) => {
                                        return (
                                            <Row key={j}>
                                                {rowItem.map(({itemKey, itemValue}, k) => (
                                                    <Form.Group key={k} as={Col} controlId="formGridManufacturer">
                                                        <Form.Label>{itemKey}</Form.Label>
                                                        <Form.Control readOnly disabled type="text" value={itemValue}/>
                                                    </Form.Group>
                                                ))}
                                            </Row>)
                                    }
                                )}
                            </Form.Group>
                        )
                    }
            })}
        </Form>
    )
}
// this function should take an objects as an arguemnt and return an array of objects
// these objects are the key value of the deepeset level of the object
// this is used to display the tasks
// this function recursively calls itself;
function handleTasks(tasks){
    let temp = [];
    if (tasks){
        Object.entries(tasks).forEach(([key,value])=>{
            if (typeof value === "object"){
                temp = temp.concat(handleTasks(value))
            } else {
                temp.push({key:key,value:value})
            }
        })
    }
    return temp;
}
function TaskDisplay({tasks}){
    console.log(handleTasks(tasks));
    return (
        <Accordion className={"pb-5 px-5"} defaultActiveKey="0">
            {tasks && tasks.map((task,index)=>{
                return (
                    <Accordion.Item eventKey={index} key={index}>
                        <Accordion.Header>{task.task_title}</Accordion.Header>
                        <Accordion.Body>
                            {handleTasks(task.task_data).map(({key:k,value:v},j)=>{
                                return (<Container key={j}>
                                    <Row className={"pb-1"}>
                                        <Form.Label>{k}</Form.Label>
                                        <Form.Control readOnly disabled type="text" value={v}/>
                                    </Row>
                                </Container>)
                                })
                            }
                        </Accordion.Body>
                    </Accordion.Item>

                )}
            )}
        </Accordion>

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
                    <Button onKeyDown={(e)=>{
                        if (e.key === 'Enter') {
                            getSomeData()
                                .then(()=>{
                                    setResultsVisible(true);
                                });
                        }
                    }} onClick={()=> {
                        getSomeData()
                            .then(()=>{
                                setResultsVisible(true);
                            });
                    }}> Search </Button>
                </Form.Group>
            </Container>
            <hr/>
            {resultsVisible && <HardDriveDataDisplay hardDrive={hardDrive}/>}
            {resultsVisible && hardDrive.tasks && <h1 className={"px-5 pb-5 h1"}>TASKS</h1>}
            {resultsVisible && <TaskDisplay tasks={hardDrive.tasks}/>}
            <br/>
            <br/>
            <br/>

        </>

    );
}

export default SearchHardDrives;
