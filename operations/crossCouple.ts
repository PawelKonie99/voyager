import { IPermutationData } from "../interfaces";

export const crossCouple = (rodzic1: IPermutationData, rodzic2: IPermutationData, couple: IPermutationData[]) => {
    //poczatkowy index ciecia
    let start = Math.floor(Math.random() * couple[0].permutation.length - 1);
    // //koncowy index ciecia wiekszy niz startowy
    let end = Math.floor(Math.random() * (couple[0].permutation.length - start) + start);

    const ostatecznaTablicaZMiastamiDoDopushowania = [];

    const elementPoCieciuRodzica = rodzic1.permutation.slice(0, end);
    const skopiowanaCzescRodzicaDwaZaPotomkiem = rodzic2.permutation
        .slice(end, couple[0].permutation.length)
        .concat(rodzic2.permutation.slice(0, end));

    for (const element of skopiowanaCzescRodzicaDwaZaPotomkiem) {
        const czyElementJestJuzWElemenciePoCieciu = elementPoCieciuRodzica.find((czesc) => czesc === element);

        if (!czyElementJestJuzWElemenciePoCieciu) {
            ostatecznaTablicaZMiastamiDoDopushowania.push(element);
        }
    }
    // const uzueplnionaTablicaPustymiMiastami = [...elementPoCieciuRodzica];

    const ostatecznySkrzyzowanyOsobnik = elementPoCieciuRodzica.concat(ostatecznaTablicaZMiastamiDoDopushowania);
    return ostatecznySkrzyzowanyOsobnik;
};
