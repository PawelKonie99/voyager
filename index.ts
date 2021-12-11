import fs from "fs";
import { ICityData, IPermutationData } from "./interfaces";
import { countRoadForEveryPermutation } from "./operations/countRoadForEveryPermutation";
import { crossing } from "./operations/crossing";
import { drawCouple } from "./operations/drawCouple";
import { findShortestRoad } from "./operations/findShortestRoad";
import { mutatePermutation } from "./operations/mutatePermutation";
import { selection } from "./operations/selection";
import { shuffleArray } from "./operations/shuffleArray";
import { sortFormLowestToHighest } from "./operations/sortFormLowestToHighest";

const readFile = (): string[] => {
    return fs.readFileSync("/Users/pawelkonieczny/Desktop/voyager/dane/bier127.txt").toString().split("\n");
};

const parseFile = (file: string[]): ICityData[] => {
    const allDataObject = new Array<ICityData>();

    file.splice(0, 6);
    file.splice(file.length - 1, 1);

    for (const cityText of file) {
        //usuwanie nadwyzkowych spacji ze stringa oraz umieszczenie danych o jednym miescie do jednej komorki tablicy '4  11020  13456' -> ['4', '11020', '13456']
        const [city, x, y] = cityText.replace(/\s+/g, " ").trim().split(" ");
        allDataObject.push({ city, x: parseInt(x), y: parseInt(y) });
    }

    return allDataObject;
};

const start = (ileWyn: number, lbPop: number, lbOsobnikow: number) => {
    for (let i = 0; i < ileWyn; i++) {
        const file = readFile();
        const parsedFile = parseFile(file);
        const allPermutations = new Array<IPermutationData>();
        //losowanie poczatkowych osobnikow
        for (let j = 0; j < lbOsobnikow; j++) {
            shuffleArray(parsedFile, allPermutations);
        }

        const individualsAfterSelection = executeAlgorithm(allPermutations);
        populationScope(individualsAfterSelection, lbPop);
    }
};

const populationScope = (startingIndividuals: IPermutationData[], lbPop: number) => {
    let finalIndividuals = startingIndividuals;
    //w petli jest -1 bo pierwsza populacje wykonujemy wyzej jako populacje startowa
    for (let i = 0; i < lbPop - 1; i++) {
        finalIndividuals = executeAlgorithm(finalIndividuals);
    }

    const bestIndividual = findShortestRoad(finalIndividuals);

    saveToTxt(bestIndividual);
};

const executeAlgorithm = (allPermutations: IPermutationData[]): IPermutationData[] => {
    const couples = drawCouple(allPermutations);
    const crossedPermutations = crossing(couples);
    const mutatedPermutations = mutatePermutation(crossedPermutations);
    const permutationsWithDistance = countRoadForEveryPermutation(mutatedPermutations);
    const lowestToHighestDistance = sortFormLowestToHighest(permutationsWithDistance);
    const selectedPermutations = selection(lowestToHighestDistance);
    return selectedPermutations;
};

const saveToTxt = (bestIndividual: IPermutationData | undefined) => {
    const logStream = fs.createWriteStream(`wyniki.txt`, {
        flags: "a",
    });

    if (!bestIndividual) {
        return;
    }

    const allCities = [];
    for (const city of bestIndividual.permutation) {
        allCities.push(city.city);
    }
    const arrToString = JSON.stringify(allCities).replace(/,/g, " ").replace(/"/g, "").replace("[", "").replace("]", "");
    logStream.write(`${arrToString} ${bestIndividual.distance} \r\n`);
    logStream.end();
};

start(10, 1000, 100);
