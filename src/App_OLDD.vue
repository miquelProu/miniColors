<template>
  <div id="app">
      <section class="section">
          <div class="columns">
              <div class="column">
                  <div class="buttons has-addons">
                      <button class="button" @click="up">Upload</button>
                      <button class="button" @click="down">Download</button>
                  </div>
                  <textarea class="textarea is-flex" :class="{'is-hidden': isUploadHidden}" style="width: 100%;" v-model="colorDef" placeholder="Copía aquí"></textarea>
              </div>
              <div class="column">
                  <div class="buttons has-addons is-centered">
                      <button class="button" @click="">Refesh</button>
                      <button class="button" @click="clear">Clear</button>
                      <button class="button" @click="pickerClick" :style="deltaColorStyle">Similar</button>
                  </div>
                  <div v-if="pickerColor !== ''" :class="{'is-hidden': !hasPicker}">
                      <div class="is-clearfix" v-for="v in [-1, -0.5, 0, 0.5, 1]">
                          <div class="is-pulled-left" style="width: 100px;height: 20px;padding-right: 10px;"
                               :style="{backgroundColor: chromaDegrade(pickerColor.hex, v)}"
                          ></div>
                          <div class="is-pulled-left">{{chromaDegrade(pickerColor.hex, v)}}</div>
                      </div>

                  </div>
                  <chrome-picker style="margin: 0 auto;" :class="{'is-hidden': hasPicker}" :value="picker" @input="updateValue"></chrome-picker>
              </div>
              <div class="column">
                  <div class="buttons has-addons is-right">
                      <button class="button" @click="mesh">Mesh</button>
                      <button class="button" @click="getDelta" :class="{'is-loading': isDelting}" :style="deltaColorStyle">Delta</button>
                  </div>
              </div>
          </div>


      </section>
      <section class="section">
          <div class="tabs">
              <ul style="position: relative;">
                  <li :class="[tab==='model' ? 'is-active' : '']" @click="changeTab('model')"><a>Model Color</a></li>
                  <li :class="[tab==='metal' ? 'is-active' : '']"  @click="changeTab('metal')"><a>Metalitzat</a></li>
                  <li :class="[tab==='trans' ? 'is-active' : '']" @click="changeTab('trans')"><a>Transparents</a></li>
                  <li :class="[tab==='fluo' ? 'is-active' : '']"  @click="changeTab('fluo')"><a>Fluorescent</a></li>
                  <li :class="[tab==='game' ? 'is-active' : '']"  @click="changeTab('game')"><a>Game Color</a></li>
                  <li :class="[tab==='mesh' ? 'is-active' : '']"  @click="changeTab('mesh')"><a>Model + Game (Color) Mesh</a></li>
                  <li style="position: absolute;right:0;" :class="[tab==='meu' ? 'is-active' : '']"  @click="changeTab('meu')"><a>Meus</a></li>
              </ul>
          </div>
          <div class="columns is-multiline">
              <color v-for="c in vColors"
                     :key="c.referencia"
                     :col="c"
                     :isSelected="existeix(c)"
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
import { Chrome  } from 'vue-color'

import {vallejo} from './vallejo.js'
import {metalic} from './vallejo_metalitzat.js'
import {vallejo_transparent} from './vallejo_transparent.js'
import {vallejo_fluorescent} from './vallejo_fluorescent.js'
import {game_color} from './vallejo_game'

export default {
    name: 'App',
    components: {
        Color,
        'chrome-picker': Chrome,
    },
    data: function(){
      return{
          isUploadHidden: true,
          colorDef: '',

          picker: '#194d33',
          hasPicker: true,
          pickerColor: '',

          vColors: [],
          colorsSelecteds: [],
          colorsMesh: [],
          tab: 'model',
          deltaColor: null,
          isDelting: false,

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
        chromaDegrade(c, value){

           return value < 0 ? Chroma(c).darken(value * -1).hex() : Chroma(c).brighten(value).hex();
        },
        updateValue(v){
            console.log("UPDATE VALUE", v);
            this.pickerColor = v;
        },
        pickerClick(){
            if(this.hasPicker){
                this.hasPicker = false;
            } else {
                this.hasPicker = true;
                console.log("COLOR A BUSCAR", this.pickerColor);
                this.vColors = Sorts.sortedByDelta(this.vColors, this.pickerColor.hex);
                this.deltaColor = this.pickerColor.hex;
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
            } else if (t !== this.tab && t === 'mesh'){
                this.vColors = this.colorsMesh;
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
            if(this.tab === 'model'){
                this.afegeix(c, 'model');
            } else if (this.tab === 'metal'){
                this.afegeix(c, 'metal');
            } else if (this.tab === 'fluo'){
                this.afegeix(c, 'fluo');
            } else if (this.tab === 'game'){
                this.afegeix(c, 'game');
            }


            if (this.tab==='meu'){

                //this.saveSelection();
            }
        },
        mesh(){
            this.colorsMesh = [];
            this.colorsMesh = [...vallejo];
            /*for (let c of game_color){
                this.colorsMesh = this.assingColorsOnList(c, this.colorsMesh);
            }*/
        },
        assingColorsOnList(color, llistaCompleta){
            let self = this;
            let llista = llistaCompleta.filter((o) => {return o.fabricant === 'Vallejo' || o.fabricant === 'Vallejo Game Color';});
            let llistaMetal = llistaCompleta.filter((o) => {return o.fabricant === 'Vallejo metalic';});
            let llistaFluo = llistaCompleta.filter((o) => {return o.fabricant === 'Vallejo Fluorescent';});


            console.log("COLOR REFERENCIA", color)
            let oldIndex = llista.findIndex(function(o){
                //console.log(o.referencia, o.esp);
                return  o.referencia === color.referencia;
            });
            console.log(oldIndex, llista[oldIndex]);

            let taula = []
            let v = 100.0;
            let i = 0;


            for (const [index, value] of llista.entries()) {
                if (value.referencia !== color.referencia && Chroma.deltaE(color.color, value.color) < v){
                    v = Chroma.deltaE(color.color, value.color);
                    i = index;
                }
            }

            taula = [];
            console.log("I: ", i);

            let inici = (i > 1 ) ? i - 1 : 0;
            let fi = i + (i > 1) ? i + 2 : 3;
            if (fi + 1 > llista.length){
                fi = llista.length -1;
                inici = fi - 3;
            }

            console.log("INICIA: "+inici, "FI: "+fi);
            let slicedArray = llista.slice(inici, fi);
            console.log(slicedArray);
            for (let s in slicedArray){
                slicedArray[s]['delta'] = Chroma.deltaE(color.color,slicedArray[s].color)
                taula.push(slicedArray[s]);
            }
            console.log(taula);
            let delta = (taula[0].delta < taula[2].delta) ? 0 : 1;
            let ii = llista.findIndex(o => o.referencia === taula[1].referencia);

            if(oldIndex > 0) {
                console.log("MOURE: " + oldIndex + " a " + ii + " + " + delta);
                llista = arrayMoveImmutable(llista, oldIndex, ii + delta);
            } else {
                console.log("INSERTA: a " + ii + " + " + delta);
                llista.splice(ii+delta, 0, color);
            }
            return llista.concat(llistaMetal.concat(llistaFluo));
        },
        ordena(){
            console.log("ORDENA");
            let model = this.colorsSelecteds.filter((o) => {return o.fabricant === 'Vallejo' || o.fabricant === 'Vallejo Game Color';});
            let metal = this.colorsSelecteds.filter((o) => {return o.fabricant === 'Vallejo metalic';});
            let fluo = this.colorsSelecteds.filter((o) => {return o.fabricant === 'Vallejo Fluorescent';});
            model = Sorts.sortedAsVallejo(model);
            metal = Sorts.sortedAsVallejoMetal(metal);
            fluo = Sorts.sortedAsVallejoFluor(fluo);

            this.colorsSelecteds = model.concat(metal.concat(fluo));
        },
        afegeix(c){
            if(!this.existeix(c)) {

                if (c.fabricant === 'Vallejo Game Color') {
                    this.colorsSelecteds = this.assingColorsOnList(c, this.colorsSelecteds);
                } else {
                    this.colorsSelecteds.push(c);
                    console.log(this.colorsSelecteds);
                    this.ordena();
                }
                this.saveSelection();
            }
        },
        saveSelection(){
            const parsed = JSON.stringify(this.colorsSelecteds);
            localStorage.setItem('colors', parsed);
        },

        clear(){
            localStorage.clear();
            this.colorsSelecteds = [];
        },
        exists(c, llista){
            for(const co of llista){
                if (co.referencia === c.referencia){
                    return true;
                }
            }
            return false;
        },
        existeix(c){
            const existsColor = this.exists(c, this.colorsSelecteds);

            return existsColor;
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
            if(this.isUploadHidden){
                this.isUploadHidden = false;
            } else if (!this.isUploadHidden && this.colorDef == '') {
                this.isUploadHidden = true;
            } else {
                console.log("PARSED", JSON.parse(this.colorDef));
                this.unparsed(this.colorDef);
                this.colorDef = '';
                this.isUploadHidden = true;
            }
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
        unparsed(parsed){
            let temp = JSON.parse(parsed);
            console.log(temp);
            this.colorsSelecteds = temp;
        },
    },
    mounted() {
        console.log("HOLA COLORS");
        console.log("IS LOCALSTORAGE ACCESIBLE", (window.localStorage !== false));
        this.vColors = vallejo;

        if (localStorage.getItem('colors')) {
            try {
                console.log("TRY", localStorage.getItem('colors'));
                this.unparsed(localStorage.getItem('colors'));
            } catch(e) {
                console.log("CATCH");
                localStorage.removeItem('colors');
            }
        }
        this.mesh();
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
