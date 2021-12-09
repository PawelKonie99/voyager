import { IPermutationData } from "../interfaces";

export const setRanksToSortedPermutations = (allPermutationsWithDistance: IPermutationData[]): IPermutationData[] => {
    const permutationsWithRank = new Array<IPermutationData>();

    let i = 0;
    for (const permutation of allPermutationsWithDistance.reverse()) {
        i++;
        const permutationWithRank = { ...permutation, rank: i };
        permutationsWithRank.push(permutationWithRank);
    }

    return permutationsWithRank;
};
