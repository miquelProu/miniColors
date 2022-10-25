import {vallejo} from "@/vallejo";
import Chroma from 'chroma-js';

export function sortedAsVallejo(arr){
    function compare(a,b){

        let aa = 0;
        for (const [index, value] of vallejo.entries()) {
            if(value.referencia === a.referencia){
                aa = index;
            }
        }
        let bb = 0;
        for (const [index, value] of vallejo.entries()) {
            if(value.referencia === b.referencia){
                bb = index;
            }
        }

        if (aa < bb) {return -1;}
        else if (aa > bb) {return 1;}
        else {return 0}
    }
    return arr.sort(compare);
};

export function sortedByDelta(arr, deltaColor){
    function compare(a,b){
        if (Chroma.deltaE(a.color, deltaColor) < Chroma.deltaE(b.color, deltaColor)) {return -1;}
        else if (Chroma.deltaE(a.color, deltaColor) > Chroma.deltaE(b.color, deltaColor)) {return 1;}
        else {return 0}
    }
    return arr.sort(compare);
}
