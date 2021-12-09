import { IPermutationData } from "../interfaces";

export const mutatePermutation = (permutations: IPermutationData[]): IPermutationData[] => {
    //poczatkowy index ciecia
    let start = Math.floor(Math.random() * permutations[0].permutation.length);
    //koncowy index ciecia wiekszy niz startowy
    let end = Math.floor(Math.random() * (permutations[0].permutation.length - start) + start + 1);

    const shouldBeMutated = Math.random();

    const permutationsAfterMutation = new Array<IPermutationData>();
    for (const permutationData of permutations) {
        const { permutation } = permutationData;
        if (shouldBeMutated > 0.7) {
            while (start < end) {
                let t = permutation[start];
                permutation[start++] = permutation[end];
                permutation[end--] = t;
            }
            permutationsAfterMutation.push({ ...permutationData, permutation });
        } else {
            permutationsAfterMutation.push(permutationData);
        }
    }

    return permutationsAfterMutation;
};
