import SearchAlgorithm from "./searchAlgorithm";

export default class NaiveSearch extends SearchAlgorithm {
    run(userQuery:string){
        this.userQuery = userQuery;
        this.indexOfMatch = this.db.indexOf(userQuery)
        if(this.indexOfMatch > 0){
            return this.formattedResult();
        }
        return false;
    }
}