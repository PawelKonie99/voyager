import { IPermutationData } from "../interfaces";
import { countRoadDistance } from "./countRoadDistance";

export const findShortestRoad = (allPermutations: IPermutationData[]): IPermutationData | undefined => {
    const allDistances: number[] = [];
    for (const permutationData of allPermutations) {
        allDistances.push(countRoadDistance(permutationData.permutation));
    }

    const shortestRoad = Math.min(...allDistances);
    const permutationWithShortestRoad = allPermutations.find((permutation) => permutation.distance === shortestRoad);

    if (!permutationWithShortestRoad) {
        return;
    }
    permutationWithShortestRoad.permutation.push(permutationWithShortestRoad.permutation[0]);

    return permutationWithShortestRoad;
};
