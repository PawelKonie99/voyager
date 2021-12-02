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
    { city: "5", x: 11420, y: 12356 },
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

//dobieranie w pary losowe permutacje
const drawCouple = (data: IAllData[][]) => {
    const copiedArray = [...data];
    // let tempValue
    // if(copiedArray.length % 2 !== 0) {
    //     tempValue = copiedArray[copiedArray.length]
    // }
    // copiedArray.pop()

    //przygotowanie odpowiedniej tablicy, np z 8 osobnikow bedzie wygladac tak [ [], [], [], [] ]
    //https://stackoverflow.com/questions/50542832/how-to-separate-the-array-into-an-array-of-random-pairs-no-repeats
    const shuffledArray: IAllData[][][] = Array.from(Array(Math.ceil(copiedArray.length / 2)), () => []);
    let aN = 0;

    while (copiedArray.length) {
        shuffledArray[aN].push(copiedArray.splice(Math.random() * copiedArray.length, 1)[0]);
        if (shuffledArray[aN].length === 2) aN++;
    }

    return shuffledArray;
};

const crossCouples = (couples: IAllData[][][]) => {
    const allCrossedPermutations = [];
    for (const couple of couples) {
        if (couple.length !== 1) {
            let start = Math.floor(Math.random() * couple[0].length - 1);
            // //koncowy index ciecia wiekszy niz startowy
            let end = Math.floor(Math.random() * (couple[0].length - start) + start);

            const [rodzic1, rodzic2] = couple;

            const elementPoCieciuRodzica = rodzic1.slice(0, end);
            const skopiowanaCzescRodzicaDwaZaPotomkiem = rodzic2.slice(end, couple[0].length).concat(rodzic2.slice(0, end));

            const ostatecznaTablicaZMiastamiDoDopushowania = [];

            for (const element of skopiowanaCzescRodzicaDwaZaPotomkiem) {
                const czyElementJestJuzWElemenciePoCieciu = elementPoCieciuRodzica.find((czesc) => czesc === element);

                if (!czyElementJestJuzWElemenciePoCieciu) {
                    ostatecznaTablicaZMiastamiDoDopushowania.push(element);
                }
            }
            // const uzueplnionaTablicaPustymiMiastami = [...elementPoCieciuRodzica];

            const ostatecznyZkrzyzowanyOsobnik = elementPoCieciuRodzica.concat(ostatecznaTablicaZMiastamiDoDopushowania);
            allCrossedPermutations.push(ostatecznyZkrzyzowanyOsobnik);
            // for (let i = 0; i < couple[0].length - elementPoCieciuRodzica.length; i++) {
            //     uzueplnionaTablicaPustymiMiastami.push({ city: "ex", x: 0, y: 0 });
            // }
        } else {
            allCrossedPermutations.push(couple[0]);
        }

        //poczatkowy index ciecia
    }
    return allCrossedPermutations;
};

const selection = (allPermutationsWithDistance: IAllData[][]) => {};

const file = readFile();
const parsedFile = parseFile(file);
// console.log(parsedFile);
const test = countRoadDistance(parsedFile);
// shuffleArray(parsedFile);
// shuffleArray(parsedFile);
// shuffleArray(parsedFile);
// shuffleArray(parsedFile);
// shuffleArray(parsedFile);
// shuffleArray(parsedFile);
// shuffleArray(parsedFile);
// console.log(allPermutations);
shuffleArray(testArray);
shuffleArray(testArray);
shuffleArray(testArray);
shuffleArray(testArray);
shuffleArray(testArray);
shuffleArray(testArray);
shuffleArray(testArray);
const { allDistances, permutationsWithDistance } = countRoadForEveryPermutation(allPermutations);
const lowestToHighestDistance = sortFormLowestToHighest(permutationsWithDistance);
console.log(lowestToHighestDistance);
const test3 = mutatePermutation(parsedFile);
console.log(test3);
const couples = drawCouple(allPermutations);
console.log(couples);
const crossedPermutations = crossCouples(couples);
console.log(crossedPermutations);
