export default function handleRes(res:any){
    return (status:number,message:string)=>res.status(status).send(message)
}