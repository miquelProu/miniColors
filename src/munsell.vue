<template>
    <div class="content is-clearfix">
        <div>Delta: {{delta.toFixed(2)}} Color: {{color.rgb}} Munsell: {{munsellColor}} || Hue: {{indX * 4.5}} Saturació: {{((indFulla * 0.05) + 1).toFixed(2)}} Luminositi: {{(indY * 0.05) + 1}}  Fulla: {{indFulla + 1}}/18 X:{{indX + 1}} Y:{{indY + 1}}</div>
        <div class="content is-clearfix" v-for="(va, idx) in valors[this.indFulla]" style="margin-bottom: 0;position:relative;">
            <div v-for="(v, iddx) in va" style="width: 15px;height: 15px;" class="is-pulled-left" :style="estil(v, idx, iddx)"></div>
            <div style="position: absolute; left: 0;top:0">
                <div v-for="(vv, idddx) in categoriesArray" style="width: 15px;height: 15px;background-color: transparent;" :style="catEstil(vv)" class="is-pulled-left"></div>
            </div>
        </div>
    </div>
</template>

<script>

import Chroma from "chroma-js";


export default {
    name: "munsell",
    components:{
        Chroma,
    },
    props: {
        color:{
            required: false,
            type: Object
        }
    },
    data: function (){
        return {
            h: 0,
            arr: [0.8, 0.6, 0.4, 0.2],
            arrGraus: [],
            valors: [],
            indFulla: 0,
            indY: 0,
            indX: 0,
            delta: 100,
            munsellColor: '',
            categoriesArray: [13,5,5,5,5,5,5,7,9,1,1,1,5,7,15,11,13,5,7,9,1,7,11,15,11,13,5,5,5,5,5,5,5,5,5,5,5,5,5,7,
                9,1,1,7,9,1,3,13,0,0,0,6,9,1,1,0,1,1,3,12,6,13,4,5,4,5,5,5,5,7,13,1,1,1,3,9,1,1,1,3,
                8,0,6,9,0,0,0,3,8,4,6,9,0,0,0,0,0,0,0,1,1,7,9,1,1,1,1,1,1,1,3,8,0,0,2,8,0,0,0,2,
                8,6,11,12,4,0,4,6,14,13,1,0,0,0,0,0,0,0,0,0,2,9,0,0,0,0,0,0,0,0,2,8,0,0,2,12,0,0,0,2,
                10,9,0,1,1,14,9,1,1,3,8,0,0,0,0,0,0,0,0,0,2,8,0,0,0,0,0,0,0,0,2,8,0,0,0,3,12,0,0,2,
                10,9,0,0,6,9,0,0,4,6,12,4,4,4,0,0,0,0,0,0,2,12,4,4,4,0,0,0,0,0,6,8,0,0,0,0,3,12,4,6,
                13,4,4,6,13,4,4,6,9,1,1,1,1,3,12,4,4,4,4,4,4,7,9,3,15,12,4,4,4,6,13,4,4,4,4,4,4,5,5,7,
                13,5,5,5,5,5,5,5,4,4,4,4,4,4,5,5,5,5,5,5,5,5,4,4,5,5,5,5,5,7,15,13,5,5,5,5,5,5,5,7]
        }
    },
    computed: {
        colorProp(){
            return this.color.rgb;
        }
    },
    watch:{
        color(){
            console.log("NEW COLOR", this.colorProp);
            this.find();
        },
    },
    methods:{
        catEstil(v){
            let retorn = ''
            let bin = this.dec2bin(v);
            if(bin.length < 4){
                if(bin.length == 3){
                    bin = '0'+bin;
                } else if(bin.length == 2){
                    bin = '00'+bin;
                } else {
                    bin = '000'+bin;
                }
            }
            let idx = 3;
            for(let b of bin){
                if(idx == 0 && b == '1') {
                    retorn = retorn + "border-top:1px solid white;";
                }
                if(idx == 1 && b == '1') {
                    retorn = retorn + "border-right:1px solid white;";
                }
                if(idx == 2 && b == '1') {
                    retorn = retorn + "border-bottom:1px solid white;";
                }
                if(idx == 3 && b == '1') {
                    retorn = retorn + "border-left:1px solid white;";
                }
                idx = idx - 1;
            }
            console.log(v, retorn);
            return retorn;
        },
        dec2bin(dec) {
            return (dec >>> 0).toString(2);
        },
        estil(col, idx, iddx){
            let retorn = {'background-color': col};
            if(this.indX === iddx && this.indY === idx){
                let contrast = (Chroma.contrast(col,'#000') > Chroma.contrast(col, '#FFF')) ? 'black' : 'white';
                console.log("CONTRAST", contrast)
                retorn['border'] = '1px solid ' + contrast;

            } else {
                retorn['border'] = '1px solid ' + col;
            }
            return retorn;
        },
        find(){
            this.delta = 100;
            for (let [ffulla, fulla] of this.valors.entries()){
                for(let [yy, y] of fulla.entries()){
                    for(let [xx, x] of y.entries()){
                        let delta = Chroma.deltaE(this.colorProp, x);
                        if(delta < this.delta){
                            this.delta = delta;
                            this.indFulla = ffulla;
                            this.indY = yy;
                            this.indX = xx;
                            this.munsellColor = x;
                        }
                    }
                }
            }
            console.log(this.delta);
            console.log("FULLA", this.indFulla);
            console.log(this.indY, this.indX);
            this.$forceUpdate();
        },
    },
    mounted() {
        console.log("HOLA MUNSELL", this.color);

        let self = this;
        for (let c = 0; c < 360; c = c + 4.5){
            self.arrGraus.push(c);
        }

        for(let i = 0.9; i > 0.1; i=i-0.05) {
            let temp2 = []
            for (let f = 0.9; f > 0.1; f = f - 0.05) {
                let temp = []
                for (let v of this.arrGraus) {let retorn = Chroma.hsl(v, f, i).hex();
                    temp.push(retorn);
                }
                temp2.push(temp);
            }
            self.valors.push(temp2);
        }
        console.log(this.valors);
        this.find();
    }
}
</script>

<style scoped lang="scss">

/*
https://heropatterns.com/
 */

</style>
