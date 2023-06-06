import SearchAlgorithm from "./searchAlgorithm";

export default class NaiveSearch extends SearchAlgorithm {
    init(db:any){
        this.db = db;
    }
    run(userQuery:string){
        this.userQuery = userQuery;
        this.indexOfMatch = this.db.indexOf(this.userQuery)
        if(this.indexOfMatch >= 0){
            return this.formattedResult();
        }
        return false;
    }
}