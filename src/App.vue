<template>
    <div id="app">
        <div id="navbar">
            <h1>MM GYM</h1>
        </div>
        <div id="main-content">
            <router-view></router-view>
        </div>
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
    }

    #app {
        min-height: 100vh;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        background-image: url(../public/background.jpg);
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
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

    #main-content {
        padding-top: 150px; 
        min-height: auto; 
        overflow-y: auto; 
    }
</style>
