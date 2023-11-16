<template>
    <div class="columns is-multiline">
        <div class="column is-1 is-clearfix"  v-for="(col, index) in compareCols"
             :key="index">
            <div style="width: 80px;margin:0 auto;">
                <div style="width: 80px;height: 80px;position: relative;" class="xis-pulled-left" :style="{'background-color': col.rgb}">
                    <div style="position: absolute; top:25%; left:25%;width: 50%; height: 50%;" :style="{'background-color': color.rgb}"></div>
                </div>
                <div class="columns m-0">
                    <div class="column is-half is-offset-half has-text-centered p-0" :style="backgroundDelta(col)">
                        <span style="font-size: 0.7rem;font-weight: bold;text-align: right;">{{(Math.round(colorDelta(col) * 100) / 100).toFixed(2)}}</span>
                    </div>
                </div>
            </div>
            <div class="is-flex is-flex-direction-column has-text-centered">
                <div style="font-weight: bold;">{{col.name}}</div>
                <div style="font-size: 0.8rem;">{{col.marca}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import Colorjs from 'colorjs.io'

export default{
    name: "CompareColors",
    props:{
        compareColors:{
            required: true,
            type: Array,
        },
        color:{
            required: true,
            type: Object,
        }
    },
    data: function(){
        return{
            compareCols: [],
        }
    },
    computed:{},
    watch:{
        compareColors(){
            this.compareCols = this.compareColors;
            //this.$forceUpdate();
        }
    },
    methods: {
        colorDelta(col){
            return Colorjs.deltaE(col.rgb, this.color.rgb, "2000")
        },
        backgroundDelta(col){
            let delta = this.colorDelta(col);
            let back = '';
            let colo = '';
            if (delta < 1){
                back = "limegreen";
                colo = "white";
            } else if(delta < 2) {
                back = "green";
                colo = "black";
            } else if (delta < 5) {
                back = "orange";
                colo = "black";
            } else if (delta < 10) {
                back = "red";
                colo = "white";

            } else {
                back = "darkred";
                colo = "white";
            }
            let base = {'background-color': back, 'color': colo}
            return base;
        },
    },
    mounted(){
        console.log("HOLA COMPARE COLORS");
        this.compareCols = this.compareColors;
    }
}


</script>


<style scoped lang="scss">
 .gg{
     color: limegreen;
 }
</style>
