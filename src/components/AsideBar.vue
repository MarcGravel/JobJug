<template>
    <div>
        <div id="asideBar">
            <div id="imgCont">
                <img src="@/assets/jobjugLogo.png" alt="Logo">
            </div>
            <div id="curUser">
                <ChangePassword :user="user"/>
            </div>
            <div id="menuItems">
                <v-list-item id="listItem"
                    v-for="item in items"
                    :key="item.title"
                    :to="item.route"
                    @click="redirectLogout(item.title)"
                    >
                    <v-icon id="icons">{{ item.icon }}</v-icon>
                    <h3>{{item.title}}</h3>
                </v-list-item>
            </div>
        </div>
    </div>
</template>

<script>
import router from '../router'
import cookies from 'vue-cookies'
import axios from 'axios'
import ChangePassword from '../components/ChangePassword.vue'

    export default {
        name: "AsideBar",
        props: ["user"],
        components: {
            ChangePassword
        },
        data() {
            return {
                items: [
                    { title: 'Schedule', icon: 'event_note', route: '/schedule' },
                    { title: 'Jobs', icon: 'construction', route: '/jobs' },
                    { title: 'Employees', icon: 'badge', route: '/users' },
                    { title: 'Clients', icon: 'people', route: '/clients' },
                    { title: 'Log Out', icon: 'logout' },
                ],
            }
        },
        methods: {
            redirectLogout(title) {
                let session = cookies.get('session');
                let token = session.token;

                if (title == "Log Out") {
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/login',
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'sessionToken': token
                        }
                    }).then(() => {
                        cookies.remove('session');
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
    #asideBar {
        display: none;
    }

    @media screen and (min-width: 1100px) {
        #asideBar {
            display: block;
            background: rgb(82,171,152);
            background: linear-gradient(90deg, rgba(82,171,152,1) 0%, rgba(94,176,158,1) 100%);
            color: #215463;
            width: 100%;
            height: 100vh;
            display: grid;
            grid-template-rows: 10vh 5vh 75vh;
            overflow: hidden;

            #imgCont {
                grid-row: 1;
                width: 100%;
                height: 10vh;

                img {
                    width: 100%;
                }
            }

            #curUser {
                grid-row: 2;
                text-align: center;
                display: grid;
                align-items: center;

                h3 {
                    cursor: pointer;
                    color: #f5fffd; 
                }
            }

            #curUser:hover {
                background-color: #45a18d;
            }

            #menuItems {
                grid-row: 3;

                #listItem {
                    width: 100%;
                    height: 10vh;
                    background-color: transparent;
                    display: grid;
                    grid-template-rows: 50% 50%;

                    #icons {
                        grid-row: 1;
                        text-align: center;
                        font-size: 2em;
                        margin-top: 10px;
                    }

                    h3 {
                        grid-row: 2;
                        text-align: center;
                        color: black
                    }
                }

                #listItem:hover {
                    background-color: #45a18d;
                }
            }
        }
    }
</style>