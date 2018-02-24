<template>
  <div class="main">
        <h1 class='title'>{{ pseudo.toUpperCase() }}</h1>
        <div class='middle'>
            <span class='start' @click="send()"></span>
            <draggable v-model="liste" class="dragArea1" :options="{animation: 150,group:{name:'block',pull:false}}">
                <div class='block' v-for="(element,index) in liste" :key="element.uid" :class="element.class">
                    <span></span>
                    <button class='button' @click="remove(liste,index)">&times;</button>
                </div>
            </draggable>
        </div>
        <div class='bottom'>
            <draggable v-model="blockStart" class="dragArea" :options="{animation: 150,sort:false,group:{ name:'block',  pull:'clone', put:true}}" :clone="cloneBlock">
                <div class='block' v-for="(element) in blockStart" :key="element.id" :class="element.class">
                    <span></span>
                    <button class='button' @click="quickSend(element.class)">⏩</button>
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
            pseudo: localStorage.getItem('nom') || 'Joueur sans nom',

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
            newUid: 0,
        }
    },
    methods:{
        remove: function (liste,index){
            liste.splice(index,1)
        },
        emitMessage(blocks) {
            console.log('Emit message', blocks);
            socket.emit('run', {
                robot: 1,
                blocks: blocks,
            });
        },
        send: function(){
            let emitBlocks = []
            this.liste.forEach(element => {
                console.log(element.class)
                emitBlocks.push(element.class)
            });

            this.emitMessage(emitBlocks);
        },
        quickSend(blockClass) {
            this.emitMessage([blockClass]);
        },
        cloneBlock(original) {
            let deepCopy = JSON.parse(JSON.stringify(original));
            deepCopy.uid = ++this.newUid;

            return deepCopy;
        },
    },
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
    background: white url(./../assets/forward.png) no-repeat center;
    background-size: contain;

}
.backward {
    background: white url(./../assets/backward.png) no-repeat center;
    background-size: contain;

}
.left {
    background: white url(./../assets/left.png) no-repeat center;
    background-size: contain;

}
.right {
    background: white url(./../assets/right.png) no-repeat center;
    background-size: contain;

}
.grab {

    background: white url(./../assets/grab.png) no-repeat center;
    background-size: contain;
}
.release {
    background: white url(./../assets/release.png) no-repeat center;
    background-size: contain;

}
.bottom:hover {
    background-color: aquamarine
}
.block {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    height: 100px;
    width: 100px;
    margin: 20px;
    background-color: azure;
    color: white;
}
.middle {
    display: table;
    margin: 20px;
    padding: 10px;
}
.start {
    background: url(./../assets/start.png) no-repeat center;
    background-size: contain;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    margin: 20px;
    height: 100px;
    width: 100px;
}
.start:active {
    transform: rotate(7deg);
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
.block:hover .button {
    display: block;
}
.button {
    display: none;
    position: absolute;
    font-size: 10px;
    background: white;
    border-radius: 3px;
    border: none;
    padding: 0;
    height: 20px;
    width: 20px;
    order: 0;
    left: 0;
    right: 65px;
    margin:auto;
    bottom: 6%;

}
</style>
