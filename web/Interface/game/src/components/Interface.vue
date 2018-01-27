<template>
  <div class="main">
        <h1 class='title'>{{ pseudo.toUpperCase() }}</h1>
        <div class='middle'>
            <span class='start'>start</span>
            <draggable v-model="liste" class="dragArea1" :options="{animation: 300,group:{name:'block',pull:false}}">
                <div class='block' v-for="element in liste" v-bind:key="element">{{element.name}}</div>
            </draggable>
        </div>
        <div class='bottom'>
            <draggable v-model="blockStart" class="dragArea" :options="{animation: 300,sort:false,group:{ name:'block',  pull:'clone', put:true}}">
                <div class='block' v-for="element in blockStart" v-bind:key="element" ><span v-bind:class='element.name'>{{element.name}}</span></div>
            </draggable>
        </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import block from './Block'
export default {

    name: 'Interface',
    components:{
        draggable,
        block
    },
    data () {
        return {
            pseudo: 'bluedrack',

            blockStart: [
                {id: 0, class: 'avancer', name:'avancer'},
                {id: 1, class: 'reculer', name:'reculer'},
                {id: 2, class: 'tournerG', name:'tourner gauche'},
                {id: 3, class: 'tournerD', name:'tourner droite'},
                {id: 4, class: 'saisir', name:'saisir'},
                {id: 5, class: 'lacher', name:'lacher'},
            ],
            liste: [],
            parentMsg: 10,
        }
    }
}
</script>

<style>
body {
    margin: 0;
    font-family: Roboto;
    font-size: 20px;
}
.main {
    margin: 0;
}
.title {
    text-align: center;
    font-family: Roboto;
}
.bottom {
    display: inline-block;

    background-color: tomato;
    position: fixed;
    text-align: center;
    bottom: 0;
    height: 20%;
    width: 100%;
    color: white;
}

.bottom:hover {
    background-color: aquamarine
}
.block {
    background: white url(../assets/ouvrir.png) no-repeat center;
    display: inline-block;
    position: relative;
    vertical-align: middle;
    height: 90px;
    width: 100px;
    margin: 20px;
    background-color: azure;
    color: black;
    border-radius: 5%;
}
.middle {
    display: table;
    margin: 20px;
    padding: 10px;
    background-color: tomato;
}
.start {
    background-color: green;
    display: inline-block;
    vertical-align: middle;
    border: solid green 10px;
    margin: 20px;
    height: 90px;
    width: 100px;
    border-radius: 5%;
}
.dragArea {
    padding: 10px;
    background-color: blue;
}
.dragArea1 {
    text-align: center;
    display: inline;
    padding: 10px;
    background-color: blue;
}
</style>
