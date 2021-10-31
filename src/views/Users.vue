<template>
    <div id="usersPage">
        <div id="navBar">
            <NavBar :user="user" />
        </div>
        <div id="asideBar">
            <AsideBar :user="user" />
        </div>
        <div id="usersToolBar"> 
            <h1>ToolBar</h1>
        </div>
        <div id="usersContainer">
            <h1>Users Page</h1>
        </div>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import router from '../router'
import axios from 'axios'
import NavBar from '../components/NavBar.vue'
import AsideBar from '../components/AsideBar.vue'

    export default {
        name: "Users",
        components: {
            NavBar,
            AsideBar,
        },
        computed: {
            sessionCookie() {
                return cookies.get('session') 
            },
        },
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
                user: '',
                token: '',
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
    #usersPage {
        width: 100%;
        min-height: 100%;
        height: fit-content;
        background-color: #f5fffd;

        #usersToolBar {
            background-color: #2b6777;
            margin-top: 56px;
            color: whitesmoke;
        }
    }

    @media screen and (min-width: 700px) {
        #usersPage {

            #usersToolBar {
                margin-top: 68px;
            }
        }
    }

    @media screen and (min-width: 1100px) {
        #usersPage {
            display: grid;
            grid-template-columns: 10% 90%;
            grid-template-rows: 10% 90%;

            #asideBar {
                grid-column: 1;
                position: fixed;
                width: 10%;
                z-index: 99;
            }

            #usersToolBar {
                margin-top: 0;
            }

            #usersContainer {
                grid-row: 2;
                grid-column: 2;
                margin-top: 0;
            }
        }
    }
</style>