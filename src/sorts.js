import {vallejo} from "@/vallejo";
import {metalic} from '@/vallejo_metalitzat.js'
import {vallejo_fluorescent} from "@/vallejo_fluorescent"
import Chroma from 'chroma-js';
import Colorjs from 'colorjs.io'

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

export function sortedAsVallejoMetal(arr){
    function compare(a,b){

        let aa = 0;
        for (const [index, value] of metalic.entries()) {
            if(value.referencia === a.referencia){
                aa = index;
            }
        }
        let bb = 0;
        for (const [index, value] of metalic.entries()) {
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

export function sortedAsVallejoFluor(arr){
    function compare(a,b){

        let aa = 0;
        for (const [index, value] of vallejo_fluorescent.entries()) {
            if(value.referencia === a.referencia){
                aa = index;
            }
        }
        let bb = 0;
        for (const [index, value] of vallejo_fluorescent.entries()) {
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

export function sortedByDeltaCustom(arr, deltaColor, deltaKind){
    function compare(a, b){
        if (Colorjs.deltaE(a.rgb, deltaColor.rgb, deltaKind) < Colorjs.deltaE(b.rgb, deltaColor.rgb, deltaKind)) {
            return -1;
        } else if (Colorjs.deltaE(a.rgb, deltaColor.rgb, deltaKind) > Colorjs.deltaE(b.rgb, deltaColor.rgb, deltaKind)) {
            return 1;
        } else {
            return 0;
        }
    }
    return arr.sort(compare);
}

export function sortedByDefault(arr, vColor){
    return arr.sort((a, b) => {
        return vColor.findIndex(p => p.name === a.name) - vColor.findIndex(p => p.name === b.name);
    });
}
