<template>
    <div id="jobsPage">
        <div id="navBar">
            <NavBar />
        </div>
        <div id="asideBar">
            <AsideBar />
        </div>
        <div id="jobsContainer">
            <div id="toolBar">
                <Toolbar />
            </div>
            <h1>Jobs Page</h1>
        </div>
    </div>
</template>

<script>
import router from '../router'
import cookies from 'vue-cookies'
import NavBar from '../components/NavBar.vue'
import AsideBar from '../components/AsideBar.vue'
import Toolbar from '../components/Toolbar.vue'

    export default {
        name: "Jobs",
        components: {
            NavBar,
            AsideBar,
            Toolbar
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
    #jobsPage {
        width: 100vw;
        min-height: 100%;
        height: fit-content;
        background-color: #f5fffd;

        #jobsContainer {
            margin-top: 56px
        }
    }

    @media screen and (min-width: 700px) { 
        #jobsPage {

            #jobsContainer {
                margin-top: 68px
            }
        }
    }

    @media screen and (min-width: 1100px) { 
        #jobsPage {
            display: grid;
            grid-template-columns: 10% 90%;

            #asideBar {
                grid-column: 1;
                position: fixed;
                width: 10%;
            }

            #jobsContainer {
                grid-column: 2;
                margin-top: 0;
            }
        }
    }
</style>