import SearchAlgorithm from "./algorithms/searchAlgorithm";

export default class Search {
    algorithms: any | SearchAlgorithm[]
    searchQueue:string[]
    db:string[] | undefined;
    constructor(){
        this.algorithms=[];
        this.searchQueue = [];
    }
    init(db:string[]){
        let upperCaseDB = db.map((row:string)=>row.toUpperCase());
        this.db = upperCaseDB;
        this.algorithms.forEach((algorithm:any | SearchAlgorithm)=>algorithm.init(upperCaseDB));
    }
    addAlgorithm(algorithm:SearchAlgorithm){
        this.algorithms.push(algorithm);
    }
    addQueryToQueue(userQuery:string){
        this.searchQueue.push(userQuery);
    }
    quickSearch(userQuery:string){
        this.addQueryToQueue(userQuery);
        return this.run();
    }
    run(){
        let result;
        if(!this.db)throw new Error("Database not initialized");
        let userQuery = this.searchQueue.shift();
        if(!userQuery)return undefined;
        for(let i = 0 ; i < this.algorithms.length; i++){
            let algorithm = this.algorithms[i];
            result = algorithm.run(userQuery.toUpperCase());
            if(result)break;
        }
        return result;
    }
}