<template>
    <div id="homePage">
        <div id="navBar">
            <NavBar />
        </div>
        <div id="asideBar">
            <AsideBar />
        </div>
        <div id="homeContainer">
            <h1>Home Page</h1>
        </div>
    </div>
</template>

<script>
import router from '../router'
import cookies from 'vue-cookies'
import NavBar from '../components/NavBar.vue'
import AsideBar from '../components/AsideBar.vue'

    export default {
        name: "Home",
        components: {
            NavBar,
            AsideBar
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
        min-height: 100vh;
        height: fit-content;
        background-color: #f5fffd;

        #homeContainer {
            margin-top: 56px
        }
    }

    @media screen and (min-width: 700px) { 
        #homePage {

            #homeContainer {
                margin-top: 68px
            }
        }
    }

    @media screen and (min-width: 1100px) { 
        #homePage {
            display: grid;
            grid-template-columns: 10% 90%;

            #asideBar {
                grid-column: 1;
                position: fixed;
                width: 10%;
            }

            #homeContainer {
                grid-column: 2;
                margin-top: 0;
            }
        }
    }
</style>