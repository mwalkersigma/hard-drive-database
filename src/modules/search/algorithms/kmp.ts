import SearchAlgorithm from "./searchAlgorithm";
import FilteredSearch from "./filtered";
export default class KMPSearch extends SearchAlgorithm{
    dbs:string;
    delimiter:string
    constructor() {
        super();
        this.dbs = "";
        this.delimiter = "@"
    }

    init(db: any[]) {
        this.db = db;
        this.dbs = db.map(this.stripQuery).join(` ${this.delimiter} `)
    }
    getPositionOfHead(startIndex:number){
        let positionOfHead = 0;
        let headFound = false;
        while (!headFound) {
            let char = this.dbs[startIndex + positionOfHead];
            if(char === this.delimiter){
                headFound = true;
                break;
            }
            positionOfHead--
        }
        return positionOfHead + 2;
    }
    getPositionOfTail(startIndex:number){
        let suspectedLength = 0 ;
        let tailFound = false;
        while (!tailFound) {
            let char = this.dbs[startIndex + suspectedLength];
            if(char === this.delimiter){
                tailFound=true;
                break;
            }
            suspectedLength++
        }
        return suspectedLength - 2;
    }
    run(userQuery:string){
        let sanitizedUserInput = this.stripQuery(userQuery);
        let kmp = this.knuthMorrisPratt(this.dbs,sanitizedUserInput)
        if(kmp >= 0){
            let head = this.getPositionOfHead(kmp);
            let tail = this.getPositionOfTail(kmp) - head + 1;
            let suspectedString = Array.from(this.dbs).splice(kmp + head,tail).join("").replace(/ /g,"0");
            let filteredSearch = new FilteredSearch();
            filteredSearch.init(this.db);

            let result = filteredSearch.run(suspectedString);
            if(!result)return false;
            return {...result , ...{foundWith:this.name,kmpIndex:kmp,suspectedLength:suspectedString.length,userQuery:sanitizedUserInput}};
        }else{
            return false;
        }
    }
    buildPatternTable(word:string) {
        const patternTable = [0];
        let prefixIndex = 0;
        let suffixIndex = 1;

        while (suffixIndex < word.length) {
            if (word[prefixIndex] === word[suffixIndex]) {
                patternTable[suffixIndex] = prefixIndex + 1;
                suffixIndex += 1;
                prefixIndex += 1;
            } else if (prefixIndex === 0) {
                patternTable[suffixIndex] = 0;
                suffixIndex += 1;
            } else {
                prefixIndex = patternTable[prefixIndex - 1];
            }
        }

        return patternTable;

    }
    knuthMorrisPratt(text:string, word:string) {
        if (word.length === 0) {
            return 0;
        }

        let textIndex = 0;
        let wordIndex = 0;

        const patternTable = this.buildPatternTable(word);

        while (textIndex < text.length) {
            if (text[textIndex] === word[wordIndex]) {
                // We've found a match.
                if (wordIndex === word.length - 1) {
                    return (textIndex - word.length) + 1;
                }
                wordIndex += 1;
                textIndex += 1;
            } else if (wordIndex > 0) {
                wordIndex = patternTable[wordIndex - 1];
            } else {
                // wordIndex = 0;
                textIndex += 1;
            }
        }

        return -1;
    }
}