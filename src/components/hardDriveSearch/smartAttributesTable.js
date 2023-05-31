import {Form, Table} from "react-bootstrap";
import {toHeaderCase} from "js-convert-case";

export default function SmartAttributesTable({hardDrive}) {
    return (
        <>
            <Form.Label className={"h1 mb-3"}>SMART ATTRIBUTES</Form.Label>
            <Table style={{overflow:"none"}} striped bordered hover>
                <thead>
                <tr>
                    <th>title</th>
                    <th>value</th>
                    <th>worst</th>
                    <th>threshold</th>
                    <th>type</th>
                    <th>updated</th>
                    <th>when_failed</th>
                    <th>raw_value</th>
                </tr>
                </thead>
                <tbody>
                {hardDrive.smartAttributes.map((attribute,index)=>{
                    return (
                        <tr key={index}>
                            <td>{toHeaderCase(attribute.title)}</td>
                            <td>{attribute.value}</td>
                            <td>{attribute.worst}</td>
                            <td>{attribute.threshold}</td>
                            <td>{attribute.type}</td>
                            <td>{attribute.updated}</td>
                            <td>{attribute.when_failed}</td>
                            <td>{attribute.raw_value}</td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </>
    )
}