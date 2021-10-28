<template>
    <div id="jobsPage">
        <div id="navBar">
            <NavBar :user="user" />
        </div>
        <div id="asideBar">
            <AsideBar :user="user" />
        </div>
        <div id="toolBar">
            <Toolbar :user="user" />
        </div>
        <div id="jobsContainer">
            <h1>Jobs Page</h1>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import router from '../router'
import cookies from 'vue-cookies'
import NavBar from '../components/NavBar.vue'
import AsideBar from '../components/AsideBar.vue'
import Toolbar from '../components/Toolbar.vue'

    export default {
        name: "Jobs",
        props:["jobId"],
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
            else {
                this.loadUserData();
            }

        },
        data() {
            return {
                user: '',
            }
        },
        methods: {
            loadUserData() {
                let token = cookies.get("sessionToken");
                let userId = cookies.get("userId");
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': token
                    },
                    params: {
                        'userId': userId
                    }
                }).then((response) => {
                    this.user = response.data[0]
                }).catch((error) => {
                    console.log(error + ' error');
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    #jobsPage {
        width: 100vw;
        min-height: 100%;
        height: fit-content;
        background-color: #f5fffd;

        #jobsContainer {
            margin-top: 140px
        }
    }

    @media screen and (min-width: 700px) { 
        #jobsPage {

            #jobsContainer {
                margin-top: 152px;
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