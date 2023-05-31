export default class SearchAlgorithm {
    db:any[];
    indexOfMatch:number;
    userQuery:string;
    constructor() {
        this.db = [];
        this.indexOfMatch = -1;
        this.userQuery = "";
    }
    formattedResult(matchCandidate:any = this.db[this.indexOfMatch]){
        return {
            indexOfMatch:this.indexOfMatch,
            matchCandidate,
            foundWith:this.name,
            userQuery:this.userQuery
        }
    }
    get name(){
        return this.constructor.name;
    }
    init(db:any[]){
        this.db = db;
    }
    stripAmbiguousCharacters(userInput:string){
        return userInput.replace(/[0oO1lLIi5Ss]/g, ' ');
    }
    stripNonAlphanumericCharacters(userInput:string) {
        return userInput.replace(/[^a-zA-Z0-9\s]/g, '');
    }
    stripQuery=(userInput:string)=> {
        return this.stripAmbiguousCharacters(this.stripNonAlphanumericCharacters(userInput));
    }
    run(userQuery:string){
        throw new Error(`Default Class Implementation was passed ${userQuery}`)
    }


}