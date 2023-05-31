// this function should take an objects as an arguemnt and return an array of objects
// these objects are the key value of the deepeset level of the object
// this is used to display the tasks
// this function recursively calls itself;
import {Accordion, Row,Form,Container} from "react-bootstrap";

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
export default function TaskDisplay({tasks}){
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
                                        <Form.Control readOnly disabled type="text" value={toHeaderCase(v)}/>
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