import {Col, Form, Row} from "react-bootstrap";
import {toHeaderCase} from "js-convert-case";
import Container from "react-bootstrap/Container";

function processHardDriveData(hardDrive:any,rowSize=4){
    // { keys -> { key -> values } }
    // { keys -> [{ fieldKey, fieldValue]}
    let skippedKeys = ["report_id","batch_report_id"];
    let formatted = {};
    let count = 0;
    let fieldKeys = Object.keys(hardDrive);
    let rows = [];
    for(let fieldKey of Object.keys(hardDrive)){
        let columns = [];
        for(let itemKey of Object.keys(hardDrive[fieldKey])){
            if(!skippedKeys.includes(itemKey)) {
                let itemValue = hardDrive[fieldKey][itemKey];
                let column = {itemKey, itemValue};
                columns.push(column);
                count++;
                if (count === rowSize) {
                    rows.push(columns);
                    columns = [];
                    count = 0;
                }
            }
        }
        rows.push(columns);
        //@ts-ignore
        formatted[fieldKey] = rows;
        columns = [];
        rows = [];
        count = 0;
    }
    return formatted;
}




export default function HardDriveReportForm({hardDrive,children}: any) {
    const itemsPerRow = 4;
    let rows: any = [];
    let formatted: any = {}
    let count = 0;
    Object.entries(hardDrive).forEach(([fieldKey, fieldValue]: any[]) => {
        let temp: any[] = [];
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
    formatted = processHardDriveData(hardDrive);
    return (
        hardDrive &&
            <Container>
                <Form className={"p-5 pb-0"}>
                    {Object.entries(formatted).map(([fieldKey, fieldValue]: [string, any], index) => {
                        if (fieldKey !== "tasks" && fieldKey !== "smartAttributes") {
                            return (
                                <Form.Group className={"pb-5"} key={index}>
                                    <Form.Label className={"h1 pb-3"}>{fieldKey.toUpperCase()}</Form.Label>
                                    {fieldValue.map((rowItem: { itemKey: string, itemValue: any }[], j: number) => {
                                            return (
                                                <Row key={j}>
                                                    {rowItem.map(({itemKey, itemValue}, k) =>{
                                                        if(itemKey === "report_id" || itemKey === "batch_report_id")return;
                                                        return (
                                                        <Form.Group key={k} as={Col} controlId="formGridManufacturer">
                                                            <Form.Label className={"fs-4 pb-1 text-truncate"}>{toHeaderCase(itemKey)}</Form.Label>
                                                            <Form.Control
                                                                className={"pb-1"}
                                                                readOnly
                                                                disabled
                                                                type="text"
                                                                value={itemValue ?? "n/a"}/>
                                                        </Form.Group>
                                                        )}
                                                    )}
                                                </Row>
                                            )
                                        }
                                    )}
                                </Form.Group>
                            )
                        }
                    })}
                    {hardDrive.smartAttributes.length > 0 && children }
                </Form>
            </Container>

    )
}