<template>
    <div id="homePage">
        <div id="navBar">
            <NavBar />
        </div>
        <h1>Home Page</h1>
    </div>
</template>

<script>
import router from '../router'
import cookies from 'vue-cookies'
import NavBar from '../components/NavBar.vue'

    export default {
        name: "Home",
        components: {
            NavBar
        },
        computed: {
            getToken() {
                return cookies.get('sessionToken') 
            },
        },
        //if token not valid, redirect to login
        beforeMount() {
            if (this.getToken == undefined) {
                router.push('/');
            }
        },
    }
</script>

<style lang="scss" scoped>
    #homePage {
        width: 100vw;
        height: 100vh;
        background-color: #f5fffd;
    }
</style>