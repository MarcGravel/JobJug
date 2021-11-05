<template>
    <div id="clientsPage">
        <div id="navBar">
            <NavBar :user="user" />
        </div>
        <div id="asideBar">
            <AsideBar :user="user" />
        </div>
        <div id="clientsToolBar"> 
            <ClientToolbar :user="user" @filterClients="filterClients" @createClient="openCreateOverlay"/>
        </div>
        <div id="clientsContainer">
            <h1>Client List:</h1>
            <div id="searchClient">
                <v-autocomplete
                    v-model="assignValue"
                    :items="assignMenuNames"
                    dense
                    filled
                    background-color="#D7F0EB"
                    hide-details
                    label="Search Client By Name..."
                    @keydown.enter="filterClients(assignValue)"
                ></v-autocomplete>
                <v-btn
                    id="submitSearch"
                    @click="filterClients(assignValue)">
                    Search
                </v-btn>
                <hr id="clientListSeparate">
            </div>
            <div id="clientDisplay" v-if="filterValue == 0">
                <div v-for="client in allClients" :key="client.id">
                    <ClientDisplay :user="user" :client="client" @editClient="editClient"/>
                </div>
            </div>
            <div id="clientDisplay" v-if="filterValue == 1">
                <div v-for="client in activeFilter" :key="client.id">
                    <ClientDisplay :user="user" :client="client" @editClient="editClient"/>
                </div>
            </div>
        </div>
        <v-overlay
            id="createOverlayContainer"
            :value="createOverlay"
            opacity="1"
            :absolute="absolute"
            >
            <h1>Hi</h1>
        </v-overlay>
        <v-overlay
            id="editOverlayContainer"
            :value="editOverlay"
            opacity="1"
            :absolute="absolute"
            >
            <h1>Edit</h1>
        </v-overlay>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import router from '../router'
import axios from 'axios'
import NavBar from '../components/NavBar.vue'
import AsideBar from '../components/AsideBar.vue'
import ClientToolbar from '../components/ClientToolbar.vue'
import ClientDisplay from '../components/ClientDisplay.vue'

    export default {
        name: "Clients",
        components: {
            NavBar,
            AsideBar,
            ClientToolbar,
            ClientDisplay
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

                    this.loadAllClients();

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
                userId: '',
                allClients: [],
                assignValue: '',
                assignMenuNames: [],
                activeFilter: [],
                filterValue: 0,
                editedClient: {

                },
                createOverlay: false,
                editOverlay: false,
                absolute: true,
            }
        },
        methods: {
            //takes passed data of client from clientDisplay component, sets in data and then passes as a prop to edit component
            editClient(editClient) {
                this.editedClient = editClient;
                //need overlay
            },
            openCreateOverlay() {
                this.createOverlay = !this.createOverlay;
            },
            filterClients(type) {
                if (type != null) {
                    //returns list to unfiltered main list
                    if (type == "All (Sorted By Name)") {
                        this.filterValue = 0;
                        this.loadAllClients();
                    }

                    else if (type == "ID") {
                        // clear filter
                        this.activeFilter = [];

                        //sorting algorithm to sort by ID
                        this.activeFilter = this.allClients.sort(function(a,b) {
                            let keyA = a.clientId,
                                keyB = b.clientId;
                            
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                        });
                        
                        //switches job display to filtered view
                        this.filterValue = 1;
                    }

                    else if (type == "Company") {
                        // clear filter
                        this.activeFilter = [];

                        //sorting algorithm to sort by ID
                        this.activeFilter = this.allClients.sort(function(a,b) {
                            let keyA = a.company,
                                keyB = b.company;
                            
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                        });
                        
                        //switches job display to filtered view
                        this.filterValue = 1;
                    }

                    else if (type == "active" || type == "past") {
                        //clears filter variable
                        this.activeFilter = [];

                        //make job api call to cross check client Id's on all jobs
                        //this checks if the clients are currently active or are past clients only
                        axios.request({
                            url: process.env.VUE_APP_API_SITE+'/api/jobs',
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'sessionToken': this.token
                            },
                        }).then((response) => {
                            if (type == "active") {
                                //get list of clients that are assigned to a current job by cross checking values of client id.
                                //.some tests whether an element in the array passes the check if client id matches in each array
                                let activeClients = this.allClients.filter(o1 => response.data.some(o2 => o1.clientId == o2.clientId));
                                
                                //remove duplicate clients (v = value, i = index, a = array)
                                this.activeFilter = activeClients.filter((v,i,a) => a.findIndex(t => (t.clientId == v.clientId)) == i);
                            }
                            else {
                                //same algo but with the not ( ! ) check at the .some
                                let activeClients = this.allClients.filter(o1 => !response.data.some(o2 => o1.clientId == o2.clientId));
                                
                                //remove duplicate clients (v = value, i = index, a = array)
                                this.activeFilter = activeClients.filter((v,i,a) => a.findIndex(t => (t.clientId == v.clientId)) == i);
                            }
                        }).catch((error) => {
                            console.log(error + ' error');
                        })

                        //switches user display to filtered view
                        this.filterValue = 1;
                    }

                    //search bar filter 
                    else {
                        //clears filter variable
                        this.activeFilter = [];

                        for (let i=0; i < this.allClients.length; i++) {
                            if (this.allClients[i].name == type) {
                                this.activeFilter.push(this.allClients[i])
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
            loadAllClients() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/clients',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    }
                }).then((response) => {
                    //default order of clients by first name.
                    this.allClients = response.data.sort(function(a,b) {
                        let keyA = a.name,
                            keyB = b.name;

                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                    });

                    //add client names to menu list
                    for(let i = 0; i < this.allClients.length; i++) {
                        this.assignMenuNames.push(this.allClients[i].name);
                    }
                }).catch((error) => {
                    console.log(error.response);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway&family=Righteous&display=swap');

    #clientsPage.hideOverflow {
        height: 100vh;
        overflow-y: hidden;
    }

    #clientsPage {
        width: 100%;
        min-height: 100vh;
        height: fit-content;
        background-color: #f5fffd;

        #clientsToolBar {
            background-color: #2b6777;
            margin-top: 56px;
            color: whitesmoke;
            position: fixed;
            width: 100%;
            height: 84px;
            z-index: 2;
        }

        #clientsContainer {
            margin-top: 140px;

            h1 {
                font-family: 'Righteous', cursive;
                color: #2b6777;
                margin-left: 4vw;
                margin-top: 3vh;
            }

            #searchClient {
                display: grid;

                #submitSearch {
                    background-color: #24a0ed;
                    color: whitesmoke;
                    margin-top: 1vh;
                    justify-self: end;
                    margin-right: 5vw;
                }
            }

            #clientListSeparate {
                border: 1px solid #2b6777;
                width: 60%;
                justify-self: center;
                margin-top: 2vh;
                margin-bottom: 2vh;
            }
        }
    }

    @media screen and (min-width: 700px) {
        #clientsPage {

            #createOverlayContainer {
                margin-top: 68px;

                #clientCreate {
                    width: 60vw;
                }
            }

            #editOverlayContainer {
                margin-top: 68px;

                #clientEdit {
                    width: 60vw;
                }
            }

            #clientsToolBar {
                margin-top: 68px;
            }

            #clientsContainer {
                display: grid;

                #clientDisplay, #searchclient {
                    width: 80%;
                    justify-self: center;
                }
            }
        }
    }

    @media screen and (min-width: 1100px) {
        #clientsPage {
            display: grid;
            grid-template-columns: 10% 90%;
            grid-template-rows: 10% 90%;

            #createOverlayContainer {
                margin-top: 0;
            }
            
            #editOverlayContainer {
                margin-top: 0;
            }

            #asideBar {
                grid-column: 1;
                position: fixed;
                width: 10%;
                z-index: 99;
            }

            #clientsToolBar {
                margin-top: 0;
                margin-left: 10%;
                width: 90%;
            }

            #createOverlayContainer {
                width: 90%;
                margin-left: 10%;
            }

            #clientsContainer {
                grid-row: 2;
                grid-column: 2;
                margin-top: 0;
                grid-template-rows: 10% 15% auto;

                h1 {
                    margin-left: 1vw;
                    margin-top: 2vh;
                }

                #searchClient {
                    width: 70%;
                    justify-self: start;
                    margin-left: 4vw;
                    margin-bottom: 3vh;

                    #submitSearch {
                        margin-right: 2vw;
                    }
                }

                #clientDisplay {
                    width: 70%;
                    justify-self: start;
                    margin-left: 4vw;
                }
            }
        }
    }

</style>