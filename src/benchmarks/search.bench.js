import Search from "../modules/search/search";
import fs from "fs";
import {bench} from "vitest";
import NaiveSearch from "../modules/search/algorithms/naive";
import FilteredSearch from "../modules/search/algorithms/filtered";
import KMPSearch from "../modules/search/algorithms/kmp";
import LevenshteinDistanceSearch from "../modules/search/algorithms/levenschteinDistance";

let serialSearch = new Search();
const db = JSON.parse(fs.readFileSync('./serials.json', 'utf8')).map(item=>item.serial_number);
bench("Search.run() 'naivePath' ",()=>{
    serialSearch.addQueryToQueue("0016D0210738ECC62B0087142DC0110B");
    serialSearch.run();
},{
    setup:()=>{
        serialSearch.algorithms = [];
        serialSearch.addAlgorithm(new NaiveSearch());
        serialSearch.init(db);
    }
})
bench("Search.run() 'filteredPath' ",()=>{
    serialSearch.addQueryToQueue("0016D0210738ECC62B0087142DC0110B");
    serialSearch.run();
}, {
    setup:()=>{
        serialSearch.algorithms = [];
        serialSearch.addAlgorithm(new FilteredSearch());
        serialSearch.init(db);
    }
});

bench("Search.run() 'kmpPath ",()=>{
    serialSearch.addQueryToQueue("0016D0210738ECC62B0087142");
    serialSearch.run();
},{
    setup:()=>{
        serialSearch.algorithms = [];
        serialSearch.addAlgorithm(new KMPSearch());
        serialSearch.init(db);
    }
});

bench("Search.run() 'levensteinPath' ",()=>{
    serialSearch.addQueryToQueue("001GD0210738ECC62B0087142DC0110B");
    serialSearch.run();
},{
    setup:()=>{
        serialSearch.algorithms = [];
        serialSearch.addAlgorithm(new LevenshteinDistanceSearch());
        serialSearch.init(db);
    }
})