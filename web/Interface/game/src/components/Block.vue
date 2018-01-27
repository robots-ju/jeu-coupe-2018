<template>
    <div class='block'>
        <span class='text'>{{ message }}</span>
    </div>
</template>

<script>
export default {
    name: 'Block',
    components:{
    },
    props:['message'],

    data () {
        return {
            info: 'Super Block'
        }
    }
}
</script>

<style>

.block {
    margin: 20px;
}
.text {
    font-family: Arial, Helvetica, sans-serif;
}
</style>
