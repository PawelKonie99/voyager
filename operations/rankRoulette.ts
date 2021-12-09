import { IPermutationData } from "../interfaces";

export const rankRoulette = (permutationsWithValue: IPermutationData[]) => {
    //maksymalna wartosc math ranndoma, trzeba ja ustalic bo bez tego wychodziloby ponad najwyzsza wartosc ranku
    const maxSeedValue = permutationsWithValue[permutationsWithValue.length - 1].value;
    const seedValue = Math.random() * maxSeedValue;

    const choosenPermutation = permutationsWithValue.find((permutation) => seedValue < permutation.value);

    if (!choosenPermutation) {
        throw console.log("BLAD PRZY WYBIERANIU PERMUTACJI");
    }

    return choosenPermutation;
};
