<template>
  <div class="main">
        <h1 class='title'>{{ pseudo.toUpperCase() }}</h1>
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
        <div class='loading' id='loading'>
            <span class='text front'>loading</span>
            <div id='animate'></div>


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
                        put:true
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
const socket = io.connect('http://127.0.0.1:8080');
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
        start() {
            let loading = document.getElementById('loading')
            let animate = document.getElementById('animate')
            let id = setInterval(frame, 1)
            loading.style.visibility = 'visible'
            let index = 0;
            function frame() {
                console.log('coucou')

                if(index >= document.body.clientWidth-20){
                    animate.style.width = '0px';
                    loading.style.visibility = 'hidden'
                    clearInterval(id)
                }
                index += 10;
                animate.style.width = index+'px';
            }
            console.log(loading.style)

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
    margin: 100px;
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
@keyframes pulse {
  100% {

  }
}
.dragArea {
    padding: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background-color: gray;
}
.dragArea1 {
    text-align: center;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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

.loading {
    position: absolute;

    bottom: 20%;
    left: 0;
    right: 0;
    text-align: center;
}
#animate {
    background-color: gray;
    position: absolute;
    z-index: -1;
    top: 0;
    bottom: 0;
    width: 10px;
    height: 100px;
}
</style>
