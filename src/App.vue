<template>
  <div id="app">
      <section class="botons section is-clearfix">
          <div class="field  is-pulled-right">
              <p class="control">
                  <button class="button is-link" :class="(isLoading) ? 'is-loading' : ''" @click="canviarVista()">Canviar vista {{(colorsSelecteds.length !== 0) ? "("+colorsSelecteds.length+")" : ''}}</button>
              </p>
          </div>
          <div class="field is-normal has-addons is-pulled-left">
              <p class="control">
                  <button class="button is-link" @click="saveSelection()">
                      <span class="file-icon">
                            <font-awesome-icon icon="fa-solid fa-floppy-disk"/>
                          </span>
                  </button>
              </p>
              <p class="control">
                  <button class="button is-danger" @click="deleteSelection()">
                      <span class="file-icon">
                            <font-awesome-icon icon="fa-solid fa-eraser"/>
                          </span>
                  </button>
              </p>
              <p class="control">
                  <button class="button" @click="down()">
                      <span class="file-icon">
                            <font-awesome-icon icon="fa-solid fa-download"/>
                          </span>
                  </button>
              </p>
              <div class="file is-normal is-pulled-left" :class="uploadState">
                  <label class="file-label">
                      <input class="file-input" type="file" name="resume"  ref="theFile" @change="uploadFile()">
                      <span class="file-cta">
                          <span class="file-icon">
                            <font-awesome-icon icon="fa-solid fa-upload"/>
                          </span>
                        </span>
                  </label>
              </div>
          </div>


      </section>
      <section class="section">

          <div class="field is-horizontal">
              <div class="field-label is-small">
                  <label class="label">Nom del color</label>
              </div>
              <div class="field-body">
                  <div class="field has-addons">
                      <p class="control is-expanded has-icons-right">
                          <input class="input is-small" style="border-color: hsl(0deg, 0%, 71%);" type="text" placeholder="Text input"  v-model="textBuscar" @change="changeTextBuscar">
                          <span class="icon is-small is-right is-clickable" @click="textBuscar=''"><font-awesome-icon icon="fa-solid fa-xmark"/></span>
                      </p>
                      <p class="control is-small">
                          <a class="button is-static is-small">
                              {{updateLen}}
                          </a>
                      </p>
                  </div>
              </div>
          </div>

          <div class="field is-horizontal">
              <div class="field-label">
                  <label class="label">Fabricant</label>
              </div>
              <div class="field-body">
                  <div class="field is-narrow">
                      <div class="control">
                          <label class="checkbox" v-for="(marca, index) in modelMarcaTotal" :key="index">
                              <input type="checkbox" name="marca" :value="marca" style="margin-right: 5px;margin-left: 10px;"
                              v-model="modelMarca" @change="changeMarca()">{{marca}}
                          </label>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      <section class="section" v-if="munsellColor !== ''">
          <munsell :color="munsellColor"></munsell>
      </section>
      <section class="section"  v-if="colorToCompare">
          <div class="columns">
              <div class="column is-4">
                  <color :col="colorToCompare"></color>
              </div>
              <div class="column">
                  <button class="button is-small" @click="colorToCompare=''">Close</button>
              </div>
          </div>
          <compare-colors :compare-colors="comparedColors" :color="colorToCompare"></compare-colors>
      </section>
     <section class="section">
         <div class="columns is-multiline is-vcentered">
             <div class="column is-2"
                  v-for="(color, index) in filterColor"
                  :key="index">
                 <color :col="color"
                        @selected="colorSelected"
                        @afegit="addPropi"
                        @esborrat="esborratPropi"
                        @munsell="escullMunsell"
                        :is-meu="isInMeu(color)"
                        :is-selected-view="isViewingSelectedColors"
                 ></color>
             </div>
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
import CompareColors from "@/compareColors.vue";
import Munsell from "@/munsell.vue";

import Colorjs from 'colorjs.io'
import Chroma from 'chroma-js'
import Axios from 'axios'
import * as Sorts from './sorts.js'
import {arrayMoveImmutable} from 'array-move';
import { Chrome  } from 'vue-color'
/*
import {vallejo} from './vallejo.js'
import {metalic} from './vallejo_metalitzat.js'
import {vallejo_transparent} from './vallejo_transparent.js'
import {vallejo_fluorescent} from './vallejo_fluorescent.js'
import {game_color} from './vallejo_game'
*/
import Kunst from "@/marcasNames";

import  {newAK3} from "@/newAk3";
import {newModelColor} from "@/newModelColor";
import {newGameColor} from "@/newGameColor";
import {newCitadelBase} from "@/newCitadelBase";
import {newCitadelLayer} from "@/newCitadelLayer";
import {newCitadelShade} from "@/newCitadelShade";
import {newPanzerAces} from "@/newPanzerAces";
import {newArmyPainter} from "@/newArmyPainter";
import {newCoreColors} from "@/newCoreColors";
import {newP3} from "@/newP3";
import {sortedByDefault} from "./sorts.js";


export default {
    name: 'App',
    components: {
        Color,
        'chrome-picker': Chrome,
        CompareColors,
        Munsell,
    },
    data: function(){
      return{
          modelMarcaTotal: [Kunst.AK3, Kunst.MODEL, Kunst.GAME,
              Kunst.PANZER, Kunst.C_BASE, Kunst.C_LAYER,
              Kunst.C_SHADE, Kunst.ARMY, Kunst.CORE, Kunst.P3],
          modelMarca: [Kunst.AK3, Kunst.MODEL, Kunst.GAME,
              Kunst.PANZER, Kunst.C_BASE, Kunst.C_LAYER,
              Kunst.C_SHADE, Kunst.ARMY, Kunst.CORE, Kunst.P3],
          textBuscar: '',
          textBuscarBackup: '',
          vColors: [],
          Kunst: Object.freeze(Kunst),
          selectedColor: null,
         // comparedColors: [],
          colorToCompare: null,
          colorsSelecteds: [],
          allColors: [],
          colorDef: '',
          isUploadHidden: true,
          isViewingSelectedColors: false,
          updateLen: 0,
          uploadState:'',
          isLoading: false,
          munsellColor: '',


          picker: '#194d33',
          hasPicker: true,
          pickerColor: '',


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
        },
        filterColor(){
            let self = this;
            let retorn = this.vColors.filter(item => {
                return self.modelMarca.includes(item.marca);
            });
            if(this.textBuscar.length > 3) {
                retorn = retorn.filter(item => {
                       return (
                            (item.name.toLowerCase().includes(self.textBuscar.toLowerCase())) ||
                             item.code.replace('.', '').includes(self.textBuscar.replace('.', ''))
                        );
                });
            }
            this.updateLen = retorn.length;
            return retorn;
        },

        filterColorOnlyMarcas(){
            let self = this;
            return this.vColors.filter(item => {
                return self.modelMarca.includes(item.marca);
            });
        },
        comparedColors(){
            /*this.findDelta("76");
            this.findDelta("CMC");
            this.findDelta("2000");
            this.findDelta("ITP");*/
            let copia = [...this.filterColorOnlyMarcas];
            //console.log("FILTER", this.filterColorMethod());
            let ss = Sorts.sortedByDeltaCustom(copia, this.selectedColor, "2000");
            let inici = (this.isViewingSelectedColors) ? 0: 1;
            return ss.slice(inici, 24 + inici);
        },
    },
    methods:{
        changeMarca(){
            console.log(this.modelMarca);
        },
        changeTextBuscar(){
            console.log(this.textBuscar);
        },


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

        getDelta(){
            if(this.isDelting){
                this.isDelting = false;
                this.deltaColor = null;
            } else {
                this.isDelting = true;
            }
        },

        mesh(){
            this.colorsMesh = [];
            this.colorsMesh = [...vallejo];
            /*for (let c of game_color){
                this.colorsMesh = this.assingColorsOnList(c, this.colorsMesh);
            }*/
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
        unparsed(parsed){
            let temp = JSON.parse(parsed);
            console.log(temp);
            this.colorsSelecteds = temp;
        },
        saveSelection(){
            const parsed = JSON.stringify(this.colorsSelecteds);
            localStorage.setItem('colors', parsed);
            console.log("SAVED", localStorage.getItem('colors'));
        },
        deleteSelection(){
            localStorage.removeItem('colors');
            this.colorsSelecteds = [];
            console.log("SELECTION AND LOCAL STORAGE DELETED!");
        },
        uploadFile(){
            let file = this.$refs.theFile.files[0];
            let self = this;
            let reader = new FileReader();

            reader.readAsText(file);

            reader.onload = function() {
                if (reader.result) {
                    let response;
                    try {
                        response = JSON.parse(reader.result);
                        self.colorsSelecteds = response;
                        self.uploadState = 'is-success';
                    } catch (e) {
                        self.uploadState = ' is-danger ';
                        return console.error(e); // error in the above string (in this case, yes)!
                    }
                    console.log(response);

                }
            };
        },
        findDelta(tipus){
            let self = this;
            let prop = 99;
            let col = null;
            for (let c of this.vColors){
                let val = Colorjs.deltaE(self.selectedColor.rgb, c.rgb, tipus);
                if (c.name != self.selectedColor.name && val < prop){
                    prop = val;
                    col = c
                }
            }
            console.log("APROP "+tipus, col);
            console.log("Delta", prop);
        },
        isInMeu(col){
            return this.colorsSelecteds.find(function(el){ return el.name === col.name }) !== undefined;
        },
        normalize(colors, marca){
            let sortida = []
            for (let c of colors){
                let temp = {}
                temp['name'] = c.name;
                temp['rgb'] = c.rgb;
                if (!c.hasOwnProperty('excludeFromColorMatches')){
                    temp['excludeFromColorMatches'] = false
                }

                temp['code'] = '';
                if (c.hasOwnProperty('code')){
                    temp['code'] = c.code;
                }
                temp['marca'] = marca
                sortida.push(temp);
            }

            return sortida;
        },
        addPropi(col){
            this.colorsSelecteds.push(col);
            this.colorsSelecteds= Sorts.sortedByDefault(this.colorsSelecteds, this.allColors);

            console.log(col);
            console.log(this.colorsSelecteds);
        },
        esborratPropi(col){
            let i = this.vColors.findIndex(p => p.name === col.name)
            this.vColors.splice(i,1);
            this.colorsSelecteds.splice(i, 1);
            this.updateLen = this.vColors.length;
        },
        escullMunsell(col){
            this.munsellColor = col;
        },
        colorSelected(col){
            console.log("COLOR SELECTED:", col);
            this.selectedColor = col;
            this.colorToCompare = this.selectedColor;
            console.log(this.comparedColors);
        },

        loadColors(){
            this.vColors = this.normalize(newAK3, Kunst.AK3);
            this.vColors.push(...this.normalize(newModelColor, Kunst.MODEL));
            this.vColors.push(...this.normalize(newGameColor, Kunst.GAME));
            this.vColors.push(...this.normalize(newPanzerAces, Kunst.PANZER));
            this.vColors.push(...this.normalize(newCitadelBase, Kunst.C_BASE));
            this.vColors.push(...this.normalize(newCitadelLayer, Kunst.C_LAYER));
            this.vColors.push(...this.normalize(newCitadelShade, Kunst.C_SHADE));
            this.vColors.push(...this.normalize(newArmyPainter, Kunst.ARMY));
            this.vColors.push(...this.normalize(newCoreColors, Kunst.CORE));
            this.vColors.push(...this.normalize(newP3, Kunst.P3));
            this.updateLen = this.vColors.length;
            console.log("TOTAL COLORS", this.vColors.length)
        },
        canviarVista(){
            let self = this;
            this.isLoading = true;
            if (!this.isViewingSelectedColors) {
                this.allColors = [];
                this.allColors = [...this.vColors];
                this.vColors = [];
                this.vColors = [...this.colorsSelecteds];
                this.textBuscarBackup = this.textBuscar;
                this.textBuscar = '';
            } else {
                this.colorsSelecteds = []
                this.colorsSelecteds = [...this.vColors];
                this.vColors = []
                this.vColors = [...this.allColors];
                this.textBuscar = this.textBuscarBackup;
            }
            this.isViewingSelectedColors = !this.isViewingSelectedColors;
            this.$nextTick(() => {
                self.isLoading = false;
                // ...other synchronous work here that causes other DOM changes
            })
        }
    },
    mounted() {
        console.log("HOLA COLORS");
        console.log("IS LOCALSTORAGE ACCESIBLE", (window.localStorage !== false));
        this.loadColors()

        if (localStorage.getItem('colors')) {
            try {
                console.log("TRY", localStorage.getItem('colors'));
                this.unparsed(localStorage.getItem('colors'));
            } catch(e) {
                console.log("CATCH");
                localStorage.removeItem('colors');
            }
        }
        //this.mesh();
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
    font-size: 0.8rem;



}
</style>
