<template>
    <div class="content color-sample has-text-centered">
        <div class="taca" :style="rellenu" :title="col.name"></div>
        <div class="text-taca has-text-centered">
            <div class="name">
                <span :style= "[isMeu ? {'text-decoration': 'underline'} : {}]">{{col.name}}</span></div>
            <div class="marca">{{col.marca}}</div>
            <div class="icones">
                <span v-if="!isSelectedView" @click="clickat" class="icon is-clickable" title="Cerca semblant"><font-awesome-icon icon="fa-solid fa-eyedropper"/></span>
                <span v-if="!isSelectedView && !isMeu" @click="afegit" class="icon is-clickable" title="Afegexei-te'l"><font-awesome-icon icon="fa-solid fa-circle-plus"/></span>
                <span v-if="isSelectedView" @click="esborrat" class="icon is-clickable" title="Esborra'l"><font-awesome-icon icon="fa-solid fa-circle-minus"/></span>
<!--                <span v-if="!isSelectedView" @click="munsell" class="icon is-clickable" title="Taula Munsell"><font-awesome-icon icon="fa-solid fa-eyedropper"/></span>-->
            </div>
        </div>
    </div>
</template>

<script>

import Chroma from "chroma-js";
import Colorjs from 'colorjs.io'


export default {
    name: "color",
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
        },
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

<style lang="scss">
.color-sample{
    .taca{
        width: 50px;
        height: 50px;
        margin: 0 auto;
    }
    .text-taca{
        background-color: white;
        overflow: hidden;

        .name {
            white-space: nowrap;
            overflow: hidden;

            > span {font-weight: 700;}
        }
        .marca {
            font-size: 0.8rem;
            font-weight: 400;
        }
        .icones {}
    }
}
</style>
