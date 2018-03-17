<template>
  <div class="main">
        <div class="loader" id='loader'></div>
        <h1 class='title'>{{ pseudo.toUpperCase() }}</h1>
        <div class='center red' v-if='liste.length > limit - 1'>Le nombre de block limite atteint !</div>
        <div class='center white' v-else>Il te reste {{ limit - liste.length }} block<span v-if='limit-liste.length > 1'>s</span></div>
        <div class='center'>
            Score: <span id='score'>{{score}}</span>

        </div>
        <div class="center">
            <button class="but" @click="resetScore()">Remettre à zéro</button>
        </div>
        <div class='middle'>

            <div class='start' @click="start()"></div>
            <draggable
                v-model="liste"
                class="dragArea1"
                :options="{
                    animation: 150,
                    group:{
                        name:'block',
                        pull:true
                    }
                }"
            >
                <div
                    class='block'
                    v-for="(element,index) in liste"
                    :key="element.uid"
                    :class="element.class"
                >
                    <button
                        class='button'
                        @click="remove(liste,index)"
                    >
                        &times;
                    </button>
                </div>
            </draggable>
        </div>
        <div class='bottom'>
            <draggable
                v-model="blockStart"
                class="dragArea"
                :options="{
                    animation: 150,
                    sort:false,
                    group:{
                        name:'block',
                        pull:'clone',
                        put:false
                    }
                }"
                :clone="cloneBlock"
            >
                <div
                    class='block'
                    v-for="(element) in blockStart"
                    :key="element.id"
                    :class="element.class"
                >
                    <button class='button' @click="quickSend(element.class)">
                        ⏩
                    </button>
                </div>
            </draggable>
        </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import io from 'socket.io-client'
const socket = io.connect('http://'+window.location.hostname+':8080')

export default {

    name: 'Interface',
    components:{
        draggable,
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
            robot: 0,
            liste: [],
            parentMsg: 10,
            newUid: 0,
            limit: 7,
            score: 0,
        }
    },
    created: function(){
        console.log('Socket logged !')
        socket.on('scoreChanged', change => {
            if (change.robot === robot) {
                this.score = change.robot
            }
        })
    },
    methods:{
        remove: function (liste,index){
            liste.splice(index,1)
        },
        emitMessage(blocks) {
            console.log('Emit message', blocks)
            socket.emit('run', {
                robot: this.robot,
                blocks: blocks,
            });
        },
        send: function(){
            console.log('Blocks sending !')
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
        start() {
            this.send()
            let loading = document.getElementById('loader')
            let animate = document.getElementById('animate')
            loading.style.visibility = 'visible'
            let index = 0;
            setTimeout(function(){
                loading.style.visibility = 'hidden'
            }, 2000);

        },
        cloneBlock(original) {
            if(this.liste.length < this.limit){
                let deepCopy = JSON.parse(JSON.stringify(original));
                deepCopy.uid = ++this.newUid;
                return deepCopy;
            }else{
                console.log('nombre de block maximum atteint')
            }

        },
        resetScore() {
            this.liste = []
            let robot = this.robot
            socket.emit('resetScore', {
                robot,
            });
        },
    },
}
</script>

<style>

body {
    margin: 0;
    font-family: 'Open sans', sans-serif;
    font-size: 20px;
}
.main {
    margin: 0;
}
.title {
    text-align: center;
}
.bottom {
    display: inline-block;
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
    margin: 25px;
    padding: 10px;
}
.start {
    background: url(./../assets/start.png) no-repeat center;
    border-radius: 50%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background-size: contain;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    margin: 20px;
    height: 100px;
    width: 100px;
}
.start:active {
    animation: pulse 0.1s;
    box-shadow: 0 0 0 2em rgba(#fff,0);
}
.dragArea {
    padding: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background-color: #9E9E9E;
    bottom: 0;
    position: fixed;
    left: 0;
    right: 0;
}
.dragArea1 {
    text-align: center;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    display: inline;
    padding: 10px;
    background-color: #9E9E9E;
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
.loader {
    visibility: hidden;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 55px;
    height: 55px;
    margin: -75px 0 0 -75px;
    border: 16px solid #f3f3f3;
    border-radius: 50%;
    border-top: 16px solid #9E9E9E;
    width: 60px;
    height: 60px;
    -webkit-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.center {
    display: block;
    text-align: center;
}
.red {
    color: #F44336;
}
.white {
    color: black;
}
.but {
    background: #F44336;
    color: #f3f3f3;
    border-radius: 4px;
    border: none;
    padding: 4px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

}
</style>
