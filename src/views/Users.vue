<template>
    <div id="usersPage">
        <div id="navBar">
            <NavBar :user="user" />
        </div>
        <div id="asideBar">
            <AsideBar :user="user" />
        </div>
        <div id="usersToolBar"> 
            <EmployeeToolbar :user="user" @filterUsers="filterUsers" @createUser="openCreateOverlay"/>
        </div>
        <div id="usersContainer">
            <h1>Employee List:</h1>
            <div id="searchEmployee">
                <v-autocomplete
                    v-model="assignValue"
                    :items="assignMenuNames"
                    dense
                    filled
                    background-color="#D7F0EB"
                    hide-details
                    label="Search Employee By Name..."
                    @keydown.enter="filterUsers(assignValue)"
                ></v-autocomplete>
                <v-btn
                    id="submitSearch"
                    @click="filterUsers(assignValue)">
                    Search
                </v-btn>
                <hr id="empListSeparate">
            </div>
            <div id="userDisplay" v-if="filterValue == 0">
                <div v-for="employee in allUsers" :key="employee.id">
                    <UserDisplay :user="user" :employee="employee"/>
                </div>
            </div>
            <div id="userDisplay" v-if="filterValue == 1">
                <div v-for="employee in activeFilter" :key="employee.id">
                    <UserDisplay :user="user" :employee="employee"/>
                </div>
            </div>
        </div>
        <v-overlay
            id="createOverlayContainer"
            :value="createOverlay"
            opacity="1"
            :absolute="absolute"
            >
            <div id="userCreate">
                <CreateUser @closeOverlay="createOverlay = !createOverlay" @loadUsers="loadAllUsers"/>
            </div>
        </v-overlay>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import router from '../router'
import axios from 'axios'
import NavBar from '../components/NavBar.vue'
import AsideBar from '../components/AsideBar.vue'
import UserDisplay from '../components/UserDisplay.vue'
import EmployeeToolbar from '../components/EmployeeToolbar.vue'
import CreateUser from '../components/CreateUser.vue'

    export default {
        name: "Users",
        components: {
            NavBar,
            AsideBar,
            UserDisplay,
            EmployeeToolbar,
            CreateUser
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

                    this.loadAllUsers();

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
                allUsers: [],
                activeFilter: [],
                filterValue: 0,
                createOverlay: false,
                absolute: true,
                assignValue: '',
                assignMenuNames: [],
            }
        },
        methods: {
            test() {
                console.log("test");
            },
            openCreateOverlay() {
                this.createOverlay = !this.createOverlay;
            },
            filterUsers(type) {
                if (type != null) {
                    //returns list to unfiltered main list
                    if (type == "All (sorted by name)") {
                        this.filterValue = 0;
                        this.loadAllUsers();
                    }

                    else if (type == "ID") {
                        // clear filter
                        this.activeFilter = [];

                        //sorting algorithm to sort by ID
                        this.activeFilter = this.allUsers.sort(function(a,b) {
                            let keyA = a.userId,
                                keyB = b.userId;
                            
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                        });
                        
                        //switches job display to filtered view
                        this.filterValue = 1;
                    }

                    else if (type == "Position") {
                        // clear filter
                        this.activeFilter = [];

                        //sorting algorithm by position 
                        this.activeFilter = this.allUsers.sort(function(a,b) {
                            let keyA = a.authLevel,
                                keyB = b.authLevel;
                            
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                        });
                        
                        //switches job display to filtered view
                        this.filterValue = 1;
                    }

                    else if (type == "admin" || type == "employee" || type == "manager") {
                        //clears filter variable
                        this.activeFilter = [];
                        
                        //filter all employees based on auth level

                        for (let i=0; i < this.allUsers.length; i++) {
                            if (this.allUsers[i].authLevel == type) {
                                this.activeFilter.push(this.allUsers[i])
                            }
                        }

                        //switches user display to filtered view
                        this.filterValue = 1;
                    }

                    else {
                        //clears filter variable
                        this.activeFilter = [];

                        for (let i=0; i < this.allUsers.length; i++) {
                            if (this.allUsers[i].name == type) {
                                this.activeFilter.push(this.allUsers[i])
                            }
                        }

                        this.filterValue = 1;
                    }
                }
            },
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
            loadAllUsers() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                }).then((response) => {
                    //default order of users by first name.
                    this.allUsers = response.data.sort(function(a,b) {
                        let keyA = a.name,
                            keyB = b.name;

                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                    });

                    //add employee names to menu list
                    for(let i = 0; i < this.allUsers.length; i++) {
                        this.assignMenuNames.push(this.allUsers[i].name)
                    }
                }).catch((error) => {
                    console.log(error.response);
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway&family=Righteous&display=swap');

    #usersPage {
        width: 100%;
        min-height: 100%;
        height: fit-content;
        background-color: #f5fffd;

        #createOverlayContainer {
            display: grid;
            padding-top: 56px;
            padding-bottom: 20px;
            align-items: start;

            #userCreate {
                width: 90vw;
            }
        }

        #usersToolBar {
            background-color: #2b6777;
            margin-top: 56px;
            color: whitesmoke;
            position: fixed;
            width: 100%;
            height: 84px;
        }

        #usersContainer {
            margin-top: 140px;

            h1 {
                font-family: 'Righteous', cursive;
                color: #2b6777;
                margin-left: 4vw;
                margin-top: 3vh;
            }

            #searchEmployee {
                display: grid;

                #submitSearch {
                    background-color: #24a0ed;
                    color: whitesmoke;
                    margin-top: 1vh;
                    justify-self: end;
                    margin-right: 5vw;
                }
            }

            #empListSeparate {
                border: 1px solid #2b6777;
                width: 60%;
                justify-self: center;
                margin-top: 2vh;
                margin-bottom: 2vh;
            }
        }
    }

    @media screen and (min-width: 700px) {
        #usersPage {

            #createOverlayContainer {
                margin-top: 68px;

                #userCreate {
                    width: 60vw;
                }
            }

            #usersToolBar {
                margin-top: 68px;
            }

            #usersContainer {
                display: grid;

                #userDisplay, #searchEmployee {
                    width: 80%;
                    justify-self: center;
                }
            }
        }
    }

    @media screen and (min-width: 1100px) {
        #usersPage {
            display: grid;
            grid-template-columns: 10% 90%;
            grid-template-rows: 10% 90%;

            #createOverlayContainer {
                margin-top: 0;
            }

            #asideBar {
                grid-column: 1;
                position: fixed;
                width: 10%;
                z-index: 99;
            }

            #usersToolBar {
                margin-top: 0;
                margin-left: 10%;
                width: 90%;
            }

            #createOverlayContainer {
                width: 90%;
                margin-left: 10%;
            }

            #usersContainer {
                grid-row: 2;
                grid-column: 2;
                margin-top: 0;
                grid-template-rows: 10% 15% auto;

                h1 {
                    margin-left: 1vw;
                    margin-top: 2vh;
                }

                #searchEmployee {
                    width: 70%;
                    justify-self: start;
                    margin-left: 4vw;
                    margin-bottom: 3vh;

                    #submitSearch {
                        margin-right: 2vw;
                    }
                }

                #userDisplay {
                    width: 70%;
                    justify-self: start;
                    margin-left: 4vw;
                }
            }
        }
    }
</style>