import { ICityData } from "../interfaces";

//obliczanie dlugosc drogi miedzy wszystkimi miastami w tablicy
export const countRoadDistance = (citiesArray: ICityData[]): number => {
    let distance = 0;
    for (let i = 0; i < citiesArray.length; i++) {
        if (i === citiesArray.length - 1) {
            //domkniecie trasy
            distance = Math.abs(citiesArray[i].x - citiesArray[0].x) + Math.abs(citiesArray[i].y - citiesArray[0].y) + distance;
        } else {
            distance = Math.abs(citiesArray[i].x - citiesArray[i + 1].x) + Math.abs(citiesArray[i].y - citiesArray[i + 1].y) + distance;
        }
    }
    return distance;
};
