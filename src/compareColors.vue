<template>
    <div class="columns is-multiline">
        <div class="column is-1 is-clearfix"  v-for="(col, index) in compareColors"
             :key="index">
            <div style="width: 80px;height: 80px;position: relative;" class="xis-pulled-left" :style="{'background-color': col.rgb}">
                <div style="position: absolute; top:25%; left:25%;width: 50%; height: 50%;" :style="{'background-color': color.rgb}"></div>
            </div>
            <div class="xis-pulled-left is-flex is-flex-direction-column" style="text-align: left;">
                <div style="font-size: 0.7rem;font-weight: bold;text-align: right;">{{(Math.round(colorDelta(col) * 100) / 100).toFixed(2)}}</div>
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
        return{}
    },
    computed:{},
    watch:{
        compareColors(){
            this.$forceUpdate();
        }
    },
    methods: {
        colorDelta(col){
            return Colorjs.deltaE(col.rgb, this.color.rgb, "2000")
        }
    },
    mounted(){
        console.log("HOLA COMPARE COLORS");
    }
}


</script>


<style scoped lang="scss">

</style>
