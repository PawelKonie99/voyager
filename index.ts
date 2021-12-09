import fs from "fs";
import { ICityData, IPermutationData } from "./interfaces";
import { countRoadDistance } from "./operations/countRoadDistance";
import { countRoadForEveryPermutation } from "./operations/countRoadForEveryPermutation";
import { crossing } from "./operations/crossing";
import { drawCouple } from "./operations/drawCouple";
import { mutatePermutation } from "./operations/mutatePermutation";
import { selection } from "./operations/selection";
import { sortFormLowestToHighest } from "./operations/sortFormLowestToHighest";

const readFile = (): string[] => {
    return fs.readFileSync("/Users/pawelkonieczny/Desktop/voyager/dane/bier127.txt").toString().split("\n");
};

const parseFile = (file: string[]): ICityData[] => {
    const allDataObject = new Array<ICityData>();

    file.splice(0, 6);
    file.splice(file.length - 2, 2);

    for (const cityText of file) {
        //usuwanie nadwyzkowych spacji ze stringa oraz umieszczenie danych o jednym miescie do jednej komorki tablicy '4  11020  13456' -> ['4', '11020', '13456']
        const [city, x, y] = cityText.replace(/\s+/g, " ").trim().split(" ");
        allDataObject.push({ city, x: parseInt(x), y: parseInt(y) });
    }

    return allDataObject;
};

const shuffleArray = (citiesArray: ICityData[], allPermutations: any) => {
    // tutaj kopiujemy array zeby nie pracowac na referencji
    const arrayToShuffle = [...citiesArray];

    //w tym miejscu mieszamy tablice z miastami
    for (let i = arrayToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayToShuffle[i], arrayToShuffle[j]] = [arrayToShuffle[j], arrayToShuffle[i]];
    }

    const doesPermutationAlreadyExist = allPermutations.find(
        (permutation: any) => JSON.stringify(permutation) == JSON.stringify(arrayToShuffle)
    );

    // jezeli dana permutacja wystepuje juz w tablicy z wszystkimi permutacjami to nie dodajemy jej
    if (doesPermutationAlreadyExist) {
        return;
    }

    allPermutations.push({ permutation: arrayToShuffle, value: 0, distance: 0, rank: 0 });
};

const findShortestRoad = (allPermutations: IPermutationData[]): IPermutationData | undefined => {
    const allDistances: number[] = [];
    for (const permutationData of allPermutations) {
        allDistances.push(countRoadDistance(permutationData.permutation));
    }

    const shortestRoad = Math.min(...allDistances);
    const permutationWithShortestRoad = allPermutations.find((permutation) => permutation.distance === shortestRoad);

    if (!permutationWithShortestRoad) {
        return;
    }

    return permutationWithShortestRoad;
};

const start = (ileWyn: number, lbPop: number, lbOsobnikow: number) => {
    const file = readFile();
    const parsedFile = parseFile(file);
    const allPermutations = new Array<IPermutationData>();

    for (let i = 0; i < ileWyn; i++) {
        //losowanie poczatkowych osobnikow
        for (let j = 0; j < 20; j++) {
            shuffleArray(parsedFile, allPermutations);
        }

        const individualsAfterSelection = executeAlgorithm(allPermutations);
        populationScope(individualsAfterSelection, lbPop, lbOsobnikow);
    }
};

const populationScope = (startingIndividuals: any, lbPop: number, lbOsobnikow: number) => {
    let finalIndividuals = startingIndividuals;
    //w petli jest -1 bo pierwsza populacje wykonujemy wyzej jako populacje startowa
    for (let i = 0; i < lbPop - 1; i++) {
        finalIndividuals = executeAlgorithm(finalIndividuals);
    }

    console.log(finalIndividuals);
    const bestIndividual = findShortestRoad(finalIndividuals);

    saveToTxt(bestIndividual);
};

const saveToTxt = (bestIndividual: IPermutationData | undefined) => {
    const logStream = fs.createWriteStream(`wyniki.txt`, {
        flags: "a",
    });

    if (!bestIndividual) {
        return;
    }
    for (const city of bestIndividual?.permutation) {
        logStream.write(`${city.city} `);
    }
    logStream.write(`${bestIndividual.distance}`);
    logStream.end();
};

const executeAlgorithm = (allPermutations: IPermutationData[]): any => {
    const couples = drawCouple(allPermutations);
    const crossedPermutations = crossing(couples);
    const mutatedPermutations = mutatePermutation(crossedPermutations);
    const permutationsWithDistance = countRoadForEveryPermutation(mutatedPermutations);
    const lowestToHighestDistance = sortFormLowestToHighest(permutationsWithDistance);
    const selectedPermutations = selection(lowestToHighestDistance);
    return selectedPermutations;
};

start(1, 10, 50);
