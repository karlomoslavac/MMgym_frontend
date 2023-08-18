<template>
    <div id="app">
        <div id="navbar">
            <h1>MM GYM</h1>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    #app {
        height: 100%;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        background-image: url(../public/background.jpg);
        background-size: cover;
        background-position: center;
    }

    #navbar {
        position: fixed;
        top: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5); 
        color: white;
        padding: 10px 0;
        text-align: center;
        z-index: 1000; 
    }
</style>
