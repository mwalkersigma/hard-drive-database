import Search from "../modules/search/search";
import NaiveSearch from "../modules/search/algorithms/naive";
import fs from "fs";
import FilteredSearch from "../modules/search/algorithms/filtered";
import KMPSearch from "../modules/search/algorithms/kmp";
import LevenshteinDistanceSearch from "../modules/search/algorithms/levenschteinDistance";
import * as vitest from "vitest";
const {describe, it, expect,beforeEach} = vitest;


describe('Single Result Search', () => {
    const db = JSON.parse(fs.readFileSync('./serials.json', 'utf8')).map(item=>item["serial_number"]);
    let serialSearch;
    beforeEach(()=>{
        serialSearch = new Search();
        serialSearch.addAlgorithm(new NaiveSearch());
        serialSearch.addAlgorithm(new FilteredSearch())
        serialSearch.addAlgorithm(new KMPSearch())
        serialSearch.addAlgorithm(new LevenshteinDistanceSearch())
        serialSearch.init(db);
    });
    it("should return a result object",()=>{
        let {matchCandidate,indexOfMatch,foundWith,userQuery} = serialSearch.quickSearch('0016D0210738ECC62B0087142DC0110B');
        expect(matchCandidate).toBe('0016D0210738ECC62B0087142DC0110B');
        expect(indexOfMatch).toBe(11);
        expect(foundWith).toBe('NaiveSearch');
        expect(userQuery).toBe('0016D0210738ECC62B0087142DC0110B');
    })
    it("will return false if no results are found",()=>{
        expect(serialSearch.quickSearch("fooBarBAZ")).toBe(false);
    })
    it("will use the naiveAlgorithm if the string is an exact match",()=>{
        const {foundWith} = serialSearch.quickSearch('0016D0210738ECC62B0087142DC0110B');
        expect(foundWith).toBe('NaiveSearch');
    });
    describe.each([
        ["0016D0210738ECC62B0087142DC0110B","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B0087142DC0110","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B0087142DC011","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B0087142DC01","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B0087142DC0","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B0087142DC","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B0087142D","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B0087142","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B008714","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B00871","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B0087","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B008","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B00","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B0","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62B","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC62","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC6","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738ECC","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738EC","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738E","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210738","0016D0210738ECC62B0087142DC0110B"],
        ["0016D021073","0016D0210738ECC62B0087142DC0110B"],
        ["0016D02107","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0210","0016D0210738ECC62B0087142DC0110B"],
        ["0016D021","0016D0210738ECC62B0087142DC0110B"],
        ["0016D0","0016D0210738ECC62B0087142DC0110B"],
        ["0016D","0016D0210738ECC62B0087142DC0110B"],
        ["0006","0016D0210738ECC62B0087142DC0110B"],
        ["001","0000000012060906EEB7"],
    ])("Should be able to correctly match %s", (query,expected)=>{
        it(`should match ${query} to ${expected}`,()=>{
            expect(serialSearch.quickSearch(query).matchCandidate).toBe(expected);
        })
    })

    describe.each([
        ["oo16Do21o738ECC62Boo87142DCo11oB","0016D0210738ECC62B0087142DC0110B"],
        ["O016d02l0738ecc62bO087142dc0110g","0016D0210738ECC62B0087142DC0110B"],
        ["0006D0200738ECC62B0087042DC0000B","0016D0210738ECC62B0087142DC0110B"],
        ["O016d02l0738ecc62bO08714","0016D0210738ECC62B0087142DC0110B"],
        ["O016d02l0738ecc62bO08","0016D0210738ECC62B0087142DC0110B"],
        ["O016d02l0738ecc62bO08","0016D0210738ECC62B0087142DC0110B"],
        ["0ol6d","0016D0210738ECC62B0087142DC0110B"],
    ])("despite typos, and missing characters should match %s", (query,expected)=>{
        it(`should match ${query} to ${expected}`,()=>{
            expect(serialSearch.quickSearch(query).matchCandidate).toBe(expected);
        })
    })
    describe.each([
        ['o123456789AB','0123456789AB'],
        ['l31423400230','131423400230'],
        ['1339274oo','133927400634'],
        ['13398640o133','133986400133'],
        ['1s4432400094','154432400094'],
        ['164404A01BE','164404A01BE2'],
        ['170221453907','170221453907'],
        ['172345421513',"172345421513"],
        ['002701','002701101L0K']
    ])("should be able to match %s", (query,expected)=>{
        it(`should match ${query} to ${expected}`,()=>{
            expect(serialSearch.quickSearch(query).matchCandidate).toBe(expected);
        })
    })
    describe("if database is undefined should throw an error",()=>{
        it("should throw an error",()=>{
            expect(()=>new SerialSearch()).toThrow();
        })
    })
    describe("Search.addQueryToQueue",()=>{
        it("should add a user Query to the search queue",()=>{
            serialSearch.addQueryToQueue("0016D0210738ECC62B0087142DC0110B");
            expect(serialSearch.searchQueue.length).toBe(1);
        })
    })
    describe("Search.run()",()=>{
        it("should run the search",()=>{
            serialSearch.addQueryToQueue("0016D0210738ECC62B0087142DC0110B");
            let res = serialSearch.run();
            expect(res.matchCandidate).toBe("0016D0210738ECC62B0087142DC0110B");
        })
        it("should remove the search from the queue",()=>{
            serialSearch.addQueryToQueue("0016D0210738ECC62B0087142DC0110B");
            serialSearch.run();
            expect(serialSearch.searchQueue.length).toBe(0);
        })
        it("should return undefined if no search is in the queue",()=>{
            expect(serialSearch.run()).toBe(undefined);
        })
        it("should use naive search if the query is an exact match",()=>{
            serialSearch.addQueryToQueue("0016D0210738ECC62B0087142DC0110B");
            let res = serialSearch.run();
            expect(res.foundWith).toBe('NaiveSearch');
        })
        it("should use filtered path if the string is an exact match but has typos that are ambiguous characters",()=>{
            serialSearch.addQueryToQueue("OOl6DO210738ECC62BOO87142DC0110B");
            let res = serialSearch.run();
            expect(res.foundWith).toBe('FilteredSearch');
        })
        it("should use kmp when the string is a substring of the intended query",()=>{
            serialSearch.addQueryToQueue("0016D0210738ECC62B0087");
            let res = serialSearch.run();
            expect(res.foundWith).toBe('KMPSearch');
        })
        it("should use levenshtein distance to try and guess up to 25% of a string for a user",()=>{
            serialSearch.addQueryToQueue("001GD0210738ECC62B0087142DC0110B");
            let res = serialSearch.run();
            expect(res.foundWith).toBe('LevenshteinDistanceSearch');
        })
    })
    describe("Search.quickSearch",()=>{
        it("it runs a search in one command",()=>{
            let res = serialSearch.quickSearch("0016D0210738ECC62B0087142DC0110B");
            expect(res.matchCandidate).toBe("0016D0210738ECC62B0087142DC0110B");
        });
    })
    describe("search algorithm - levenshtein",()=>{
        const lvdSearch = new LevenshteinDistanceSearch();
        const db = ['apple','banana','orange','grape'];

        lvdSearch.init(db);

        it("if we have to change more than 25% of the characters return false",()=>{
            let result = lvdSearch.run("example");
            expect(result).toBe(false);
        })
        it("if we have to change less than 25% of the characters match correctly",()=>{
            let result = lvdSearch.run("ample");
            expect(result.indexOfMatch).toBe(0);
            expect(result.matchCandidate).toBe("apple")
            expect(result.minDistance).toBe(1)
            expect(result.userQuery).toBe("ample")
        })
    })
});