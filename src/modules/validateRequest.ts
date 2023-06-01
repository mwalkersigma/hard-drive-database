import {NextApiRequest} from "next";

export default function validateRequest(req:NextApiRequest,previouslyParsed:any[]):{valid:boolean,message:string}{
    let badRequest = (message:string) => ({valid:false,message});
    if(req.method !== "POST") return badRequest("Please Make Sure To Only Send POST Requests To This Route");
    if(!req.query?.name)return badRequest("Post Requests To This Route MUST Include A file Name");
    if(!req.query?.company_name)return badRequest("Post Requests To This Route MUST Include A company_name");
    if(previouslyParsed.includes(req.query.name))return badRequest("This file has already been added to DB")
    return {valid:true,message:""};
}