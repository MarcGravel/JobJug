<template>
    <div id="navBar">
        <div id="hamburger">
            <v-icon id="icon" @click="openDrawer">{{hambIcon}}</v-icon>
        </div>
        <div id="name">
            <h2>JobJug</h2>
        </div>
        <div id="curUser">
            <h5>{{user}}</h5>
        </div>

        <v-navigation-drawer
            id="navDrawer"
            v-model="navDrawer"
            absolute
            temporary
            bottom
            color="#f5fffd"
            width="70%"
            height="fit-content">

            <v-list-item id="listItem"
                v-for="item in items"
                :key="item.title"
                :to="item.route"
                :color="item.color"
                link
                >
                <v-btn id="buttons"
                :color="item.color"
                @click="redirectLogout(item.title)">
                    <v-icon>{{ item.icon }}</v-icon>
                    <h2>{{item.title}}</h2>
                </v-btn>
            </v-list-item>

        </v-navigation-drawer>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../router'

    export default {
        name: "NavBar",
        data() {
            return {
                hambIcon: "menu",
                user: 'need usr api call',
                navDrawer: null,
                items: [
                    { title: 'Schedule', icon: 'event_note', route: '/home', color: '#57bba5' },
                    { title: 'Job Lookup', icon: 'construction', route: '/jobs', color: '#57bba5' },
                    { title: 'Employees', icon: 'badge', route: '/users', color: '#57bba5'},
                    { title: 'Clients', icon: 'people', route: '/clients', color: '#57bba5'},
                    { title: 'Log Out', icon: 'logout', color: '#f47174' },
                ],
            }
        },
        methods: {
            openDrawer() {
                this.navDrawer = !this.navDrawer;
            },
            redirectLogout(title) {
                if (title == "Log Out") {
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/login',
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'sessionToken': cookies.get('sessionToken')
                        }
                    }).then(() => {
                        cookies.remove('sessionToken');
                        cookies.remove('userId');
                        router.push('/')
                    }).catch((error) => {
                        console.log(error.response);
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

    #navBar {
        width: 100vw;
        height: 56px;
        background: rgb(82,171,152);
        background: linear-gradient(180deg, rgba(82,171,152,1) 0%, rgba(141,208,193,1) 49%, rgba(197,235,227,1) 100%);
        box-shadow: 0 3px 15px -5px black;
        display: grid;
        grid-template-columns: 20% 40% 40%;
        align-items: center;

        #hamburger {
            grid-column: 1;
            justify-self: center;
            cursor: pointer;

            #icon {
                font-size: 40px;
            }
        }

        #name {
            grid-column: 2;
            justify-self: end;

            h2 {
                font-family: 'Righteous', cursive;
                color: #2b6777;
            }
        }

        #curUser {
            grid-column: 3;
            justify-self: end;
            align-self: start;
            margin-right: 2vw;

            h5 {
                color: #2b6777;
            }
        }

        #navDrawer {
            #listItem {

                #buttons {
                    background: transparent;
                    color: #2b6777;
                    width: 100%;
                }
            }
        }
    }
</style>