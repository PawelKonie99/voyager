import { IPermutationData } from "../interfaces";

export const sortFormLowestToHighest = (permutationsWithDistance: IPermutationData[]) => {
    return permutationsWithDistance.sort((a, b) => a.distance - b.distance);
};
