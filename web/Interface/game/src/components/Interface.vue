<template>
  <div class="main">
        <h1 class='title'>{{ pseudo.toUpperCase() }}</h1>
        <div class='middle'>
            <span class='start' @click="send()">start</span>
            <draggable v-model="liste" class="dragArea1" :options="{animation: 150,group:{name:'block',pull:false}}">
                <div class='block' v-for="(element,index) in liste" v-bind:key="element" :class="element.class">
                    <span>{{element.name}}</span>
                    <button class='button' @click="remove(liste,index)">X</button>
                </div>
            </draggable>
        </div>
        <div class='bottom'>
            <draggable v-model="blockStart" class="dragArea" :options="{animation: 150,sort:false,group:{ name:'block',  pull:'clone', put:true}}">
                <div class='block' v-for="(element) in blockStart" v-bind:key="element" :class="element.class">
                    <span>{{element.name}}</span>

                    </div>
            </draggable>
        </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import block from './Block'
import io from 'socket.io-client'
const socket = io.connect('http://127.0.0.1:8080');
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
                {id: 0, class: 'forward', name:'avancer'},
                {id: 1, class: 'backward', name:'reculer'},
                {id: 2, class: 'left', name:'tourner gauche'},
                {id: 3, class: 'right', name:'tourner droite'},
                {id: 4, class: 'grab', name:'saisir'},
                {id: 5, class: 'release', name:'lacher'},
            ],
            liste: [],
            parentMsg: 10,
        }
    },
    methods:{
        remove: function (liste,index){
            liste.splice(index,1)
        },
        send: function(){
            let emitBlocks = []
            this.liste.forEach(element => {
                console.log(element.class)
                emitBlocks.push(element.class)
            });
            console.log('Emit message', emitBlocks);
            socket.emit('run', {
                robot: 1,
                blocks: emitBlocks
            })
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
.forward {
    background: white url(../assets/avancer.png) no-repeat center;
}
.backward {
    background: white url(../assets/reculer.png) no-repeat center;
}
.left {
    background: white url(../assets/gauche.png) no-repeat center;
}
.right {
    background: white url(../assets/droite.png) no-repeat center;
}
.grab {
    background: white url(../assets/fermer.png) no-repeat center;
}
.release {
    background: white url(../assets/ouvrir.png) no-repeat center;
}
.bottom:hover {
    background-color: aquamarine
}
.block {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    height: 90px;
    width: 100px;
    margin: 20px;
    background-color: azure;
    color: white;
    border-radius: 10px;
}
.middle {
    display: table;
    margin: 20px;
    padding: 10px;
}
.start {
    background-color: #a2ef44;
    display: inline-block;
    vertical-align: middle;
    border: solid #a2ef44 10px;
    margin: 20px;
    height: 90px;
    width: 100px;
}
.dragArea {
    padding: 10px;
    background-color: gray;
}
.dragArea1 {
    text-align: center;
    display: inline;
    padding: 10px;
    background-color: gray;
}
.button {
    position: absolute;
    left:0;
    right: 0;
    margin:auto;
    bottom: 2%;
}
</style>
