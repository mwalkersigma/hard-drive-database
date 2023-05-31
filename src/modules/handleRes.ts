export default function handleRes(res:any){
    return (status:number,message:string)=>{
        return res.status(status).send(message)
    }
}