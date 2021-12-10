import { IPermutationData } from "../interfaces";
import { countRoadDistance } from "./countRoadDistance";

export const countRoadForEveryPermutation = (allPermutations: IPermutationData[]): IPermutationData[] => {
    const permutationsWithDistance: IPermutationData[] = [];

    for (const permutationData of allPermutations) {
        const { permutation } = permutationData;

        try {
            permutationData.distance = countRoadDistance(permutation);
        } catch (e) {
            console.log("error in countRoadForEveryPermutation");
        }
        permutationsWithDistance.push(permutationData);
    }

    return permutationsWithDistance;
};
