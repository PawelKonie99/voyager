export interface ICityData {
    city: string;
    x: number;
    y: number;
}

export interface IPermutationData {
    permutation: ICityData[];
    value: number;
    rank: number;
    distance: number;
}
