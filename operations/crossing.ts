import { IPermutationData } from "../interfaces";
import { crossCouple } from "./crossCouple";

export const crossing = (couples: IPermutationData[][]): IPermutationData[] => {
    const allCrossedPermutations = [];
    for (const couple of couples) {
        if (couple.length !== 1) {
            //z kazdego krzyzowania wychodzi nam jeden osobnik, dlatego aby byly dwa za drugim razem zamieniamy kolejnosc rodzicow i krzyzujemy jeszcze raz
            const [rodzic1, rodzic2] = couple;
            const [rodzic3, rodzic4] = couple;

            const ostatecznySkrzyzowanyOsobnik1 = crossCouple(rodzic1, rodzic2, couple);
            const ostatecznySkrzyzowanyOsobnik2 = crossCouple(rodzic3, rodzic4, couple);

            couple[0].permutation = ostatecznySkrzyzowanyOsobnik1;
            couple[1].permutation = ostatecznySkrzyzowanyOsobnik2;
            allCrossedPermutations.push(couple[0]);
            allCrossedPermutations.push(couple[1]);
        } else {
            allCrossedPermutations.push(couple[0]);
        }
    }
    return allCrossedPermutations;
};
