import { ICityData, IPermutationData } from "../interfaces";

export const shuffleArray = (citiesArray: ICityData[], allPermutations: IPermutationData[]) => {
    // tutaj kopiujemy array zeby nie pracowac na referencji
    const arrayToShuffle = [...citiesArray];

    //w tym miejscu mieszamy tablice z miastami
    for (let i = arrayToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayToShuffle[i], arrayToShuffle[j]] = [arrayToShuffle[j], arrayToShuffle[i]];
    }

    const doesPermutationAlreadyExist = allPermutations.find(
        (permutation) => JSON.stringify(permutation) == JSON.stringify(arrayToShuffle)
    );

    // jezeli dana permutacja wystepuje juz w tablicy z wszystkimi permutacjami to nie dodajemy jej
    if (doesPermutationAlreadyExist) {
        return;
    }

    allPermutations.push({ permutation: arrayToShuffle, value: 0, distance: 0, rank: 0 });
};
