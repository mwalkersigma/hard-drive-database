import SearchAlgorithm from "./searchAlgorithm";

export default class LevenshteinDistanceSearch extends SearchAlgorithm {
    dbs:string[];
    constructor() {
        super();
        this.dbs = [];
    }
    init(db:any[]){
        this.db = db;
        this.dbs = db.map(this.stripQuery)
    }
    run(userQuery:string){
        this.userQuery = userQuery;
        let stripQuery = this.stripQuery(userQuery);

        let levenshteinDistances = this.dbs
            .map(serial=>this.levenshteinDistance(stripQuery,serial));

        let minDistance = Math.min(...levenshteinDistances)
        this.indexOfMatch = levenshteinDistances.indexOf(minDistance);
        if(this.indexOfMatch === -1)return false;
        let res = this.formattedResult();
        let candidateLength = res.matchCandidate.length;
        //filters
        if(candidateLength - userQuery.length < 0)return false;
        // if you have to change more than a fourth of the word to get there don't return it.
        if(minDistance > candidateLength / 4) return false;
        res = {...res,...{minDistance:minDistance}};
        return res;
    }
    levenshteinDistance(strOne:String, strTwo:string) {
        const distanceMatrix = Array(strTwo.length + 1)
            .fill(null)
            .map(() => Array(strOne.length + 1)
                .fill(null));

        for (let i = 0; i <= strOne.length; i += 1) {
            distanceMatrix[0][i] = i;
        }

        for (let j = 0; j <= strTwo.length; j += 1) {
            distanceMatrix[j][0] = j;
        }

        for (let j = 1; j <= strTwo.length; j += 1) {
            for (let i = 1; i <= strOne.length; i += 1) {
                const indicator = strOne[i - 1] === strTwo[j - 1] ? 0 : 1;
                distanceMatrix[j][i] = Math.min(
                    distanceMatrix[j][i - 1] + 1, // deletion
                    distanceMatrix[j - 1][i] + 1, // insertion
                    distanceMatrix[j - 1][i - 1] + indicator, // substitution
                );
            }
        }

        return distanceMatrix[strTwo.length][strOne.length];
    }
}