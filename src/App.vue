<template>
  <div id="app">
      <section class="section">
          <textarea class="textarea" v-model="colorDef" placeholder="e.g. Hello world"></textarea>
          <button class="button" @click="up">Upload</button>
        <button class="button" @click="veure">Veure-ho</button>
        <button class="button" @click="clear">Clear</button>
          <button class="button" @click="ordena">Node</button>
        <button class="button" @click="down">Download</button>
        <button class="button" @click="getDelta" :class="{'is-loading': isDelting}" :style="deltaColorStyle">Delta</button>
      </section>
      <section class="section">
          <div class="tabs">
              <ul style="position: relative;">
                  <li :class="[tab==='model' ? 'is-active' : '']" @click="changeTab('model')"><a>Model Color</a></li>
                  <li :class="[tab==='meta' ? 'is-active' : '']"  @click="changeTab('metal')"><a>Metalitzat</a></li>
                  <li :class="[tab==='trans' ? 'is-active' : '']" @click="changeTab('trans')"><a>Transparents</a></li>
                  <li :class="[tab==='fluo' ? 'is-active' : '']"  @click="changeTab('fluo')"><a>Fluorescent</a></li>
                  <li :class="[tab==='game' ? 'is-active' : '']"  @click="changeTab('game')"><a>Game Color</a></li>
                  <li style="position: absolute;right:0;" :class="[tab==='meu' ? 'is-active' : '']"  @click="changeTab('meu')"><a>Meus</a></li>
              </ul>
          </div>
          <div class="columns is-multiline">
              <color v-for="c in vColors"
                     :key="c.referencia"
                     :col="c"
                     :isSelected="exists(c)"
                     :isMeu="tab === 'meu'"
                     :delta-color="deltaColor"
                     @selected="clicka(c)"
              ></color>
          </div>
      </section>
  </div>
</template>

<script>
/**
 * <ul>
 * <li>De 0 a 1, <strong>no es perceptible por el ojo humano.</strong></li>
 * <li>De 1 a 2, <strong>es perceptible bajo atenta observasión. </strong></li>
 * <li>De 2 a 10, <strong>es perceptible de un vistazo.</strong></li>
 * <li>De 11 a 49, <strong>los colores son más parecidos que opuestos.</strong></li>
 * <li>Cuando el valor es 100, <strong>los colores son totalmente opuestos.</strong></li>
 * </ul>
 */
import Color from './color.vue'
import Chroma from 'chroma-js'
import Axios from 'axios'
import * as Sorts from './sorts.js'
import {arrayMoveImmutable} from 'array-move';

import {vallejo} from './vallejo.js'
import {metalic} from './vallejo_metalitzat.js'
import {vallejo_transparent} from './vallejo_transparent.js'
import {vallejo_fluorescent} from './vallejo_fluorescent.js'
import {game_color} from './vallejo_game'

export default {
    name: 'App',
    components: {
        Color,
    },
    data: function(){
      return{
          vColors: [],
          colorsSelecteds: [],
          tab: 'model',
          deltaColor: null,
          isDelting: false,
          colorDef: '',
      }
    },
    computed:{
        deltaColorStyle(){
            let a = {'border-color': 'transparent','color': 'rgba(0, 0, 0, 0.7)'};
            if (!this.deltaColor){
                a['background-color'] = 'hsl(44deg, 100%, 77%)';
            } else {
                a['background-color'] = this.deltaColor;
            }
            return a;
        }
    },
    methods:{
        ordencio(color){
            for (let v of vallejo) {
                console.log(v.esp+": ", Chroma.deltaE(v.color, color));
            }
        },
        changeTab(t){
            if(t !== this.tab && t === 'model'){
                this.vColors = vallejo;
            } else if (t !== this.tab && t === 'metal') {
                this.vColors = metalic;
            } else if (t !== this.tab && t === 'trans') {
                this.vColors = vallejo_transparent;
            } else if (t !== this.tab && t === 'fluo') {
                this.vColors = vallejo_fluorescent;
            } else if (t !== this.tab && t === 'game') {
                this.vColors = game_color;
            } else if (t !== this.tab && t === 'meu') {
                this.vColors = this.colorsSelecteds;
            }
            this.tab = t;


        },
        getDelta(){
            if(this.isDelting){
                this.isDelting = false;
                this.deltaColor = null;
            } else {
                this.isDelting = true;
            }
        },
        clicka(c){
            console.log("CLICKA", c);
            /*if (!this.isDelting) {
                if (this.exists(c)) {
                    let a = this.colorsSelecteds.filter(function (obj) {
                        return obj.referencia !== c.referencia;
                    });
                    this.colorsSelecteds = a;
                    this.saveSelection();
                } else {
                    this.afegeix(c);
                }
            } else {
                this.deltaColor = c.color;
                this.isDelting = false;
            }*/

            if (this.tab==='meu'){
                let self = this;
                console.log("COLOR REFERENCIA", c.referencia)
                let oldIndex = this.colorsSelecteds.findIndex(function(o){
                    console.log(o.referencia, o.esp);
                    return  o.referencia === c.referencia;
                });
                console.log(oldIndex, this.colorsSelecteds[oldIndex]);

                let taula = []
                let v = 100.0;
                let i = 0;


                for (const [index, value] of this.colorsSelecteds.entries()) {
                    if (value.referencia !== c.referencia && Chroma.deltaE(c.color, value.color) < v){
                        v = Chroma.deltaE(c.color, value.color);
                        i = index;
                        console.log("NOU DELTA:", v);
                        console.log(value.esp, index);
                    }
                }

                taula = [];
                let slicedArray = self.colorsSelecteds.slice((i > 1 ) ? i - 1 : 0, i + 2);
                for (let s in slicedArray){
                    slicedArray[s]['delta'] = Chroma.deltaE(c.color,slicedArray[s].color)
                    taula.push(slicedArray[s]);
                }
                console.log(taula);
                let delta = (taula[0].delta < taula[2].delta) ? -1 : 0;
                let ii = this.colorsSelecteds.findIndex(o => o.referencia === taula[1].referencia);

                console.log("MOURE: "+oldIndex+" a "+ii+" + "+delta);
                this.colorsSelecteds = arrayMoveImmutable(this.colorsSelecteds,oldIndex, ii+delta);

                //this.colorsSelecteds.splice(ii, 1);
                //this.colorsSelecteds.splice(ii + delta, 0, taula[1]);
                this.saveSelection();
            }
        },
        ordena(){
            console.log("ORDENA");
            this.colorsSelecteds =  Sorts.sortedAsVallejo(this.colorsSelecteds);
            this.saveSelection();
        },
        afegeix(c){
            this.colorsSelecteds.push(c);
            this.ordena();
            this.saveSelection();
        },
        saveSelection(){
            const parsed = JSON.stringify(this.colorsSelecteds);
            localStorage.setItem('colors', parsed);
        },
        veure(){
            console.log(localStorage);
        },
        clear(){
            localStorage.clear();
        },
        exists(c){
            for(const co of this.colorsSelecteds){
                if (co.referencia === c.referencia){
                    return true;
                }
            }
            return false;
        },
        download(content, fileName, contentType) {
            var a = document.createElement("a");
            var file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        },
        down(){
            this.download(JSON.stringify(this.colorsSelecteds), 'json.txt', 'text/plain');
        },
        up(){
            console.log("UNPARSED", this.colorDef);
            console.log("PARSED", JSON.parse(this.colorDef));
            this.colorsSelecteds = JSON.parse(this.colorDef);
            this.colorDef = '';
        },
        node(){
            let self = this;
            /*
            Axios.get('http://localhost:8888/api/books')
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.log("ERROR", error);
                })
                .finally(function () {
                    console.log("ALWAYS");
                });*/

            Axios.post('http://localhost:8888/api/books', self.colorsSelecteds)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
    mounted() {
        console.log("HOLA COLORS");
        console.log("IS LOCALSTORAGE ACCESIBLE", (window.localStorage !== false));
        this.vColors = vallejo;

        if (localStorage.getItem('colors')) {
            try {
                this.colorsSelecteds = JSON.parse(localStorage.getItem('colors'));
            } catch(e) {
                localStorage.removeItem('colors');
            }
        }
        console.log("COLORS", this.colorsSelecteds);

        console.log("CHROMA", Chroma.deltaE('#ececee', '#eceeec'));
        console.log("RR", Chroma('white').hsv());
  //      let color = new Color("#459205");
  //      console.log(color);
    }
}
</script>

<style lang="scss">

@import './scss/mystyles.scss';

#app {
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
    font-size: 0.8rem;


}
</style>
