<template>
    <div class="content is-clearfix">
        <div style="width: 50px;height: 50px;" class="is-pulled-left" :style="rellenu" :title="col.name">
        </div>
        <div style="background-color: white;margin-left: 10px;overflow: hidden;text-align: left;" class="is-pulled-left">
            <div style="max-width: 115px;white-space: nowrap; overflow: hidden;"><span style="font-weight: bold;" :style= "[isMeu ? {'text-decoration': 'underline'} : {}]">{{col.name}}</span></div>
            <div>{{col.marca}}</div>
            <div style="display: none;">
                <span v-if="!isSelectedView" @click="clickat" class="icon is-clickable" ><font-awesome-icon icon="fa-solid fa-eyedropper"/></span>
                <span v-if="!isSelectedView && !isMeu" @click="afegit" class="icon is-clickable"><font-awesome-icon icon="fa-solid fa-circle-plus"/></span>
                <span v-if="isSelectedView" @click="esborrat" class="icon is-clickable"><font-awesome-icon icon="fa-solid fa-circle-minus"/></span>
                <span v-if="!isSelectedView" @click="munsell" class="icon is-clickable" ><font-awesome-icon icon="fa-solid fa-eyedropper"/></span>
            </div>
        </div>
    </div>
</template>

<script>

import Chroma from "chroma-js";
import Colorjs from 'colorjs.io'


export default {
    name: "colorH",
    props: {
        col: {
            required: true,
            type: Object,
        },
        isMeu: {
            required: false,
            type: Boolean,
            default: false
        },
        deltaColor: {
            required: false,
            type: String
        },
        isSelectedView:{
            required: false,
            type: Boolean,
            default: false,
        },
    },
    data: function (){
        return {}
    },
    computed: {
        rellenu(){
            let base = {'background-color': this.col.rgb, 'color': this.col.rgb}
            return base;
        },
        colorSelector(){
            let retorn = (Chroma.contrast('#FFF', this.col.rgb) > 4.5) ? '#FFF' : '#000';
            return {'color': retorn}
        }
    },
    methods:{
        clickat(){
            this.$emit('selected', this.col);
        },
        afegit(){
            this.$emit('afegit', this.col);
        },
        delta(){
            return Chroma.deltaE(this.deltaColor, this.col.color);
        },
        esborrat(){
            this.$emit('esborrat', this.col);
        },
        munsell(){
            this.$emit('munsell', this.col);
        },
    },
    mounted() {
    }
}
</script>

<style scoped lang="scss">

</style>
