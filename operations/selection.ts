import { IPermutationData } from "../interfaces";
import { rankRoulette } from "./rankRoulette";
import { setRanksToSortedPermutations } from "./setRanksToSortedPermutations";
import { valueOfEveryPermutation } from "./valueOfEveryPermutation";

export const selection = (allPermutationsWithDistance: IPermutationData[]): IPermutationData[] => {
    const permutationsWithRank = setRanksToSortedPermutations(allPermutationsWithDistance);
    let sumOffAllRanks = 0;
    permutationsWithRank.forEach((permutation) => (sumOffAllRanks = sumOffAllRanks + permutation.rank));

    const permutationsWithValue = valueOfEveryPermutation(permutationsWithRank, sumOffAllRanks);

    const allChoosenPermutation = new Array<IPermutationData>();

    for (let i = 0; i < permutationsWithValue.length; i++) {
        const choosenPermutation = rankRoulette(permutationsWithValue);

        allChoosenPermutation.push(choosenPermutation);
    }

    return allChoosenPermutation;
};
