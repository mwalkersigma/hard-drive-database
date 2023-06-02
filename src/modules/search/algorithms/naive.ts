import SearchAlgorithm from "./searchAlgorithm";

export default class NaiveSearch extends SearchAlgorithm {
    upperCaseDB: any[];
    constructor() {
        super();
        this.upperCaseDB = [];
    }
    init(db:any){
        this.db = db;
        this.upperCaseDB = this.db.map(str=>str.toUpperCase());
    }
    run(userQuery:string){
        let query = userQuery.toUpperCase();
        this.userQuery = query
        this.indexOfMatch = this.upperCaseDB.indexOf(query)
        if(this.indexOfMatch > 0){
            return this.formattedResult();
        }
        return false;
    }
}