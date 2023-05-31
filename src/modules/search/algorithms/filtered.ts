import SearchAlgorithm from "./searchAlgorithm";

export default class FilteredSearch extends SearchAlgorithm{
    run(userQuery:string){
        this.userQuery = userQuery;
        let strippedUserQuery = this.stripQuery(userQuery);
        this.indexOfMatch = this.db.map(this.stripQuery).indexOf(strippedUserQuery);
        if(this.indexOfMatch>0){
            return this.formattedResult();
        }
        return false;
    }
}