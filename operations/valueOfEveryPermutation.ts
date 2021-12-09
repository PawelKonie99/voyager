import { IPermutationData } from "../interfaces";

export const valueOfEveryPermutation = (permutationsWithRank: IPermutationData[], sumOffAllRanks: number) => {
    const permutationsWithValue = new Array<IPermutationData>();

    for (const permutation of permutationsWithRank) {
        const value = permutation.rank / sumOffAllRanks;
        const permutationWithRank = { ...permutation, value };
        permutationsWithValue.push(permutationWithRank);
    }

    return permutationsWithValue;
};
