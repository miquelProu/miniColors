<template>
    <div class="content is-clearfix">
        <div style="width: 50px;height: 50px;" class="is-pulled-left" :style="rellenu" :title="col.name">
        </div>
        <div style="background-color: white;margin-left: 10px;overflow: hidden;text-align: left;" class="is-pulled-left">
            <div style="max-width: 115px;white-space: nowrap; overflow: hidden;"><span style="font-weight: bold;" :style= "[isMeu ? {'text-decoration': 'underline'} : {}]">{{col.name}}</span></div>
            <div>{{col.marca}}</div>
            <div>
                <span  @click="clickat" class="icon is-clickable" ><font-awesome-icon icon="fa-solid fa-eyedropper"/></span>
                <span @click="afegit" class="icon is-clickable"><font-awesome-icon icon="fa-solid fa-circle-plus"/></span>
                <span v-if="isSelectedView" @click="esborrat" class="icon is-clickable"><font-awesome-icon icon="fa-solid fa-circle-minus"/></span>
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
    },
    mounted() {
    }
}
</script>

<style scoped lang="scss">

/*
https://heropatterns.com/
 */

.selected {
    //border:1px solid red;
    //background-color: salmon;

    background-color: #ffffff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
