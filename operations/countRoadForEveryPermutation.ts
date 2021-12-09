import { IPermutationData } from "../interfaces";
import { countRoadDistance } from "./countRoadDistance";

export const countRoadForEveryPermutation = (allPermutations: IPermutationData[]): IPermutationData[] => {
    const permutationsWithDistance: IPermutationData[] = [];

    for (const permutationData of allPermutations) {
        const { permutation } = permutationData;

        permutationData.distance = countRoadDistance(permutation);
        permutationsWithDistance.push(permutationData);
    }

    return permutationsWithDistance;
};
