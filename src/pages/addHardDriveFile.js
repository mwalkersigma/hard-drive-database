import * as React from 'react';
import Container from "react-bootstrap/Container";
import {Button, Form, FormGroup, InputGroup} from "react-bootstrap";
import {useState} from "react";


function buildUploadURL(formData){
    const {file} = formData;
    // takes the user input and builds a URL to fetch from
    let hostname,port;
    if(typeof window !== "undefined"){
        hostname = window.location.hostname;
        port = window.location.port;
    }
    // value , field , table are the search params
    let searchParams = new URLSearchParams();

    searchParams.append("name", file.name);
    searchParams.append("company_name", formData.owner);

    let browserPrefix = "http://";
    let address = hostname + ":" + port;
    let APIAddress = "/api/addHardDrive.js";
    return  browserPrefix + address + APIAddress + "?" + searchParams.toString();
}
function useFormData () {
    const [state,setState] = useState({});
    function updateState(update){
        setState({...state,...update});
    }
    return [state,updateState]
}
export default function AddHardDriveFile(props){
    const [isSelected,setIsSelected] = useState(false);
    const [formData , setFormData] = useFormData()
    const changeHandler = (event) => {
        setFormData({file:event.target.files[0]})
        setIsSelected(true);
    };

    const handleSubmission = (e) => {
        let companyName = formData?.owner;
        let fileName = formData.file.name
        e.preventDefault();
        let url = buildUploadURL(formData);
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/xml"},
            body:formData.file,
        }
        fetch(url,options)
            .then(res=>{
                alert(res)
                location.reload();
            })

    };
    return (
        <Container className={"pt-3"}>
            <br/>
            <br/>
            <InputGroup>
                <Form.Control onChange={changeHandler} type={"file"}/>
                <Button disabled={!formData.owner} onClick={handleSubmission}>Upload To Server</Button>
            </InputGroup>
            {isSelected ? (
                <div>
                    <br/>
                    <Form>
                        <FormGroup className={"pb-3 pt-3"}>
                            <Form.Label className={"h3"}>Original Owner <small className={"fs-6 text-danger"}> required </small></Form.Label>
                            <Form.Control onChange={(e)=>setFormData({owner:e.target.value})}/>
                        </FormGroup>
                    </Form>
                    <hr/>
                    <p>Filename: {formData.file.name}</p>
                    <p>Filetype: {formData.file.type}</p>
                    <p>Size in bytes: {formData.file.size}</p>
                    <p>
                        lastModifiedDate:{' '}
                        {formData.file.lastModifiedDate.toLocaleDateString()}
                    </p>
                </div>
            ) : (
                <p>Select a file to show details</p>
            )}
        </Container>
    );
};