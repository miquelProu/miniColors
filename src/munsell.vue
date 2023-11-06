<template>
    <div class="content is-clearfix">
        <div>Delta: {{delta.toFixed(2)}} Color: {{color.rgb}} Munsell: {{munsellColor}} || Hue: {{indX * 4.5}} Saturació: {{((indFulla * 0.05) + 1).toFixed(2)}} Luminositi: {{(indY * 0.05) + 1}}  Fulla: {{indFulla + 1}}/18 X:{{indX + 1}} Y:{{indY + 1}}</div>
        <div class="content is-clearfix" v-for="(va, idx) in valors[this.indFulla]" style="margin-bottom: 0;">
            <div v-for="(v, iddx) in va" style="width: 15px;height: 15px;" class="is-pulled-left" :style="estil(v, idx, iddx)"></div>
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
                            console.log(delta, this.delta);
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
