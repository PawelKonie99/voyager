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

interface IPermutationWithRank extends IPermutationWithDistance {
    rank: number;
}

interface IPermutationWithValue extends IPermutationWithDistance {
    value: number;
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

const shuffleArray = (citiesArray: IAllData[], allPermutations: IAllData[][]) => {
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

//sortujemy od najmniejszego do najwiekszego
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

const crossing = (couples: IAllData[][][]) => {
    const allCrossedPermutations = [];
    for (const couple of couples) {
        if (couple.length !== 1) {
            //z kazdego krzyzowania wychodzi nam jeden osobnik, dlatego aby byly dwa za drugim razem zamieniamy kolejnosc rodzicow i krzyzujemy jeszcze raz
            const [rodzic1, rodzic2] = couple;
            const [rodzic3, rodzic4] = couple;

            const ostatecznySkrzyzowanyOsobnik1 = crossCouple(rodzic1, rodzic2, couple);
            const ostatecznySkrzyzowanyOsobnik2 = crossCouple(rodzic3, rodzic4, couple);

            allCrossedPermutations.push(ostatecznySkrzyzowanyOsobnik1);
            allCrossedPermutations.push(ostatecznySkrzyzowanyOsobnik2);
        } else {
            allCrossedPermutations.push(couple[0]);
        }
    }
    return allCrossedPermutations;
};

const crossCouple = (rodzic1: IAllData[], rodzic2: IAllData[], couple: IAllData[][]) => {
    //poczatkowy index ciecia
    let start = Math.floor(Math.random() * couple[0].length - 1);
    // //koncowy index ciecia wiekszy niz startowy
    let end = Math.floor(Math.random() * (couple[0].length - start) + start);

    const ostatecznaTablicaZMiastamiDoDopushowania = [];

    const elementPoCieciuRodzica = rodzic1.slice(0, end);
    const skopiowanaCzescRodzicaDwaZaPotomkiem = rodzic2.slice(end, couple[0].length).concat(rodzic2.slice(0, end));

    for (const element of skopiowanaCzescRodzicaDwaZaPotomkiem) {
        const czyElementJestJuzWElemenciePoCieciu = elementPoCieciuRodzica.find((czesc) => czesc === element);

        if (!czyElementJestJuzWElemenciePoCieciu) {
            ostatecznaTablicaZMiastamiDoDopushowania.push(element);
        }
    }
    // const uzueplnionaTablicaPustymiMiastami = [...elementPoCieciuRodzica];

    const ostatecznySkrzyzowanyOsobnik = elementPoCieciuRodzica.concat(ostatecznaTablicaZMiastamiDoDopushowania);
    return ostatecznySkrzyzowanyOsobnik;
};

const setRanksToSortedPermutations = (allPermutationsWithDistance: IPermutationWithDistance[]) => {
    const permutationsWithRank = new Array<IPermutationWithRank>();

    let i = 0;
    for (const permutation of allPermutationsWithDistance) {
        i++;
        const permutationWithRank = { ...permutation, rank: i };
        permutationsWithRank.push(permutationWithRank);
    }

    return permutationsWithRank;
};

const selection = (allPermutationsWithDistance: IPermutationWithDistance[]): IPermutationWithDistance[] => {
    const permutationsWithRank = setRanksToSortedPermutations(allPermutationsWithDistance);
    let sumOffAllRanks = 0;
    permutationsWithRank.forEach((permutation) => (sumOffAllRanks = sumOffAllRanks + permutation.rank));

    const permutationsWithValue = valueOfEveryPermutation(permutationsWithRank, sumOffAllRanks);

    const allChoosenPermutation = new Array<IPermutationWithValue>();

    for (let i = 0; i < permutationsWithValue.length; i++) {
        const choosenPermutation = rankRoulette(permutationsWithValue);
        allChoosenPermutation.push(choosenPermutation);
    }

    return allChoosenPermutation;
};

const valueOfEveryPermutation = (permutationsWithRank: IPermutationWithRank[], sumOffAllRanks: number) => {
    const permutationsWithValue = new Array<IPermutationWithValue>();

    for (const permutation of permutationsWithRank) {
        const value = permutation.rank / sumOffAllRanks;
        const permutationWithRank = { ...permutation, value };
        permutationsWithValue.push(permutationWithRank);
    }

    // let testValue = 0;
    // for (const test of permutationsWithValue) {
    //     testValue = test.value + testValue;
    // }

    return permutationsWithValue;
};

const rankRoulette = (permutationsWithValue: IPermutationWithValue[]) => {
    //maksymalna wartosc math ranndoma, trzeba ja ustalic bo bez tego wychodziloby ponad najwyzsza wartosc ranku
    const maxSeedValue = permutationsWithValue[permutationsWithValue.length - 1].value;
    const seedValue = Math.random() * maxSeedValue;

    const choosenPermutation = permutationsWithValue.find((permutation) => seedValue < permutation.value);

    if (!choosenPermutation) {
        throw console.log("BLAD PRZY WYBIERANIU PERMUTACJI");
    }

    return choosenPermutation;
};

//skopiowane
const start = (ileWyn: number, lbPop: number) => {
    const file = readFile();
    const parsedFile = parseFile(file);
    const allPermutations = new Array<IAllData[]>();

    for (let i = 0; i < ileWyn; i++) {
        //losowanie poczatkowych osobnikow
        for (let j = 0; j < 5; j++) {
            shuffleArray(parsedFile, allPermutations);
        }

        const individualsAfterSelection = executeAlgorithm(allPermutations);
        populationScope(individualsAfterSelection, lbPop);
    }
};

const populationScope = (startingIndividuals: any, lbPop: number) => {
    let finalIndividuals = startingIndividuals;
    //w petli jest -1 bo pierwsza populacje wykonujemy wyzej jako populacje startowa
    for (let i = 0; i < lbPop - 1; i++) {
        finalIndividuals = executeAlgorithm(finalIndividuals);
    }

    console.log(finalIndividuals);
    // const bestIndividual = getBestIndividual(finalIndividuals);
    // const wynik = quadraticFunction({ a, b, c, x: bestIndividual });

    // saveToTxt(wynik, bestIndividual);
};

const saveToTxt = (wynik: number, bestIndividual: number) => {
    const logStream = fs.createWriteStream(`wyniki.txt`, {
        flags: "a",
    });

    logStream.write(`${bestIndividual} ${wynik.toString()}\r\n`);
    logStream.end();
};

const executeAlgorithm = (allPermutations: IAllData[][]): any => {
    const couples = drawCouple(allPermutations);
    console.log(couples);
    const crossedPermutations = crossing(couples);
    const { allDistances, permutationsWithDistance } = countRoadForEveryPermutation(crossedPermutations);
    const lowestToHighestDistance = sortFormLowestToHighest(permutationsWithDistance);
    const selectedPermutations = selection(lowestToHighestDistance);
    return selectedPermutations;
};
//koniec skopiowanego
start(1, 4);

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
// shuffleArray(testArray);
// shuffleArray(testArray);
// shuffleArray(testArray);
// shuffleArray(testArray);
// shuffleArray(testArray);
// shuffleArray(testArray);
// shuffleArray(testArray);

const test3 = mutatePermutation(parsedFile);
console.log(test3);
console.log(test3);
// const couples = drawCouple(allPermutations);
// console.log(couples);
// const crossedPermutations = crossing(couples);
// console.log(crossedPermutations);
// const { allDistances, permutationsWithDistance } = countRoadForEveryPermutation(crossedPermutations);
// const lowestToHighestDistance = sortFormLowestToHighest(permutationsWithDistance);
// console.log(lowestToHighestDistance);
// const rankedPermutations = setRanksToSortedPermutations(lowestToHighestDistance);
// const selectedPermutations = selection(lowestToHighestDistance);
