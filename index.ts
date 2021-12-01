import fs from "fs";

interface IAllData {
    city: string;
    x: number;
    y: number;
}

interface IPermutationWithDistance {
    distance: number;
    permutation: IAllData[];
}

const readFile = (): string[] => {
    return fs.readFileSync("/Users/pawelkonieczny/Desktop/voyager/dane/bier127.txt").toString().split("\n");
};

const testArray = [
    { city: "1", x: 9860, y: 14152 },
    { city: "2", x: 9396, y: 14616 },
    { city: "3", x: 11252, y: 14848 },
    { city: "4", x: 11020, y: 13456 },
];

// Przykladowo jeżeli mamy miasta
// 1 3 2
// To
// dl_tr(1,3,2) = |m1 - m3| + |m3 - m2| + |m2 - m1|
// M2-m1 to domknięcie trasy

// console.log(readInterface);

const parseFile = (file: string[]): IAllData[] => {
    const allDataObject = new Array<IAllData>();

    file.splice(0, 6);
    file.splice(file.length - 2, 2);

    for (const cityText of file) {
        //usuwanie nadwyzkowych spacji ze stringa oraz umieszczenie danych o jednym miescie do jednej komorki tablicy '4  11020  13456' -> ['4', '11020', '13456']
        const [city, x, y] = cityText.replace(/\s+/g, " ").trim().split(" ");
        allDataObject.push({ city, x: parseInt(x), y: parseInt(y) });
    }

    return allDataObject;
};

//obliczanie dlugosc drogi miedzy wszystkimi miastami w tablicy
const countRoadDistance = (citiesArray: IAllData[]): number => {
    let distance = 0;
    for (let i = 0; i < citiesArray.length; i++) {
        if (i === citiesArray.length - 1) {
            //domkniecie trasy
            distance = Math.abs(citiesArray[i].x - citiesArray[0].x) + Math.abs(citiesArray[i].y - citiesArray[0].y) + distance;
        } else {
            distance = Math.abs(citiesArray[i].x - citiesArray[i + 1].x) + Math.abs(citiesArray[i].y - citiesArray[i + 1].y) + distance;
        }
    }
    return distance;
};

const allPermutations: any = [];

const shuffleArray = (citiesArray: IAllData[]) => {
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
        // console.log("elo");
        return;
    }
    // console.log("arrayToShuffle", arrayToShuffle);
    // console.log("allPermutations", allPermutations);
    allPermutations.push(arrayToShuffle);
    // console.log("citiesArray2", citiesArray);
};

const findShortestRoad = (
    allDistances: number[],
    permutationsWithDistance: IPermutationWithDistance[]
): IPermutationWithDistance | undefined => {
    const shortestRoad = Math.min(...allDistances);
    const permutationWithShortestRoad = permutationsWithDistance.find((permutation) => permutation.distance === shortestRoad);

    if (!permutationWithShortestRoad) {
        return;
    }

    return permutationWithShortestRoad;
};

const countRoadForEveryPermutation = (allPermutations: IAllData[][]) => {
    const permutationsWithDistance: IPermutationWithDistance[] = [];
    const allDistances: number[] = [];
    for (const permutation of allPermutations) {
        allDistances.push(countRoadDistance(permutation));
        permutationsWithDistance.push({ permutation, distance: countRoadDistance(permutation) });
    }

    return { allDistances, permutationsWithDistance };
};

const mutatePermutation = (permutation: IAllData[]) => {
    //poczatkowy index ciecia
    let start = Math.floor(Math.random() * permutation.length);
    //koncowy index ciecia wiekszy niz startowy
    let end = Math.floor(Math.random() * (permutation.length - start) + start + 1);

    while (start < end) {
        let t = permutation[start];
        permutation[start++] = permutation[end];
        permutation[end--] = t;
    }

    return permutation;
};

const sortFormLowestToHighest = (permutationsWithDistance: IPermutationWithDistance[]) => {
    return permutationsWithDistance.sort((a, b) => a.distance - b.distance);
};

const selection = (allPermutationsWithDistance: IAllData[][]) => {};

const file = readFile();
const parsedFile = parseFile(file);
// console.log(parsedFile);
const test = countRoadDistance(parsedFile);
shuffleArray(parsedFile);
shuffleArray(parsedFile);
shuffleArray(parsedFile);
shuffleArray(parsedFile);
shuffleArray(parsedFile);
shuffleArray(parsedFile);
shuffleArray(parsedFile);
// console.log(allPermutations);
const { allDistances, permutationsWithDistance } = countRoadForEveryPermutation(allPermutations);
const lowestToHighestDistance = sortFormLowestToHighest(permutationsWithDistance);
console.log(lowestToHighestDistance);
const test3 = mutatePermutation(parsedFile);
console.log(test3);
