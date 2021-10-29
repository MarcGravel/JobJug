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
            sessionCookie() {
                return cookies.get('session') 
            },
        },
        //if token not valid, redirect to login
        beforeMount() {
            if (this.sessionCookie == undefined) {
                router.push('/');
            }
            else {
                if (this.sessionCookie.token == undefined) {
                    router.push('/');
                }
                else {
                    this.token = this.sessionCookie.token;
                    this.userId = this.sessionCookie.userId;

                    if (this.$store.state.userInfo != undefined) {
                        this.user = this.$store.state.userInfo;
                    } else {
                        this.loadUserData();
                    }
                }
            }

        },
        data() {
            return {
                user: undefined,
                token: undefined,
                userId: undefined,
            }
        },
        methods: {
            loadUserData() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                    params: {
                        'userId': this.userId
                    }
                }).then((response) => {
                    this.user = response.data[0]
                    this.$store.commit('userData', response.data[0]);
                }).catch((error) => {
                    console.log(error.response);
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