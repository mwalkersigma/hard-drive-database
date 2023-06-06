import SearchAlgorithm from "./searchAlgorithm";

export default class FilteredSearch extends SearchAlgorithm{
    strippedQuery:string;
    constructor() {
        super();
        this.strippedQuery = "";
    }
    run(userQuery:string){
        this.userQuery = userQuery;
        this.strippedQuery = this.stripQuery(userQuery);
        this.indexOfMatch = this.db.map(this.stripQuery).indexOf(this.strippedQuery);
        if(this.indexOfMatch>=0){
            return this.formattedResult();
        }
        console.log(this)
        return false;
    }
}