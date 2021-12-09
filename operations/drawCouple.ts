import { IPermutationData } from "../interfaces";

//dobieranie w pary losowe permutacje
export const drawCouple = (data: IPermutationData[]) => {
    const copiedArray = [...data];

    //przygotowanie odpowiedniej tablicy, np z 8 osobnikow bedzie wygladac tak [ [], [], [], [] ]
    //https://stackoverflow.com/questions/50542832/how-to-separate-the-array-into-an-array-of-random-pairs-no-repeats
    const shuffledArray: IPermutationData[][] = Array.from(Array(Math.ceil(copiedArray.length / 2)), () => []);
    let aN = 0;

    while (copiedArray.length) {
        shuffledArray[aN].push(copiedArray.splice(Math.random() * copiedArray.length, 1)[0]);
        if (shuffledArray[aN].length === 2) aN++;
    }

    return shuffledArray;
};
