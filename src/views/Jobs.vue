<template>
    <div id="jobsPage">
        <div id="navBar">
            <NavBar :user="user" />
        </div>
        <div id="asideBar">
            <AsideBar :user="user" />
        </div>
        <div id="jobSearch">
            <h1>Search Jobs</h1>
            <div id="searchElements">
                <v-text-field
                label="Seach jobs here..."
                v-model="searchInput"
                outlined
                dark
                >

            </v-text-field>
            </div>
            <v-btn
                id="searchBtn"
                color="primary"
                @click="searchJobs">
                Search
            </v-btn>
        </div>
        <div id="jobsContainer">
            <h1 id="noJobMsg" v-if="jobId == undefined">Please search for a job to display.</h1>
            <div id="jobInfo" v-if="jobId != undefined">
                <h1>{{theJob.title}}</h1>
                <h3>{{theJob.location}}</h3>
                <h3>{{theJob.scheduledDate}}</h3>
                <h5>{{theJob.scheduledDate}}</h5>
                <h5>{{theJob.completedDate}}</h5>
                <h5>{{theJob.cost}}</h5>
                <h5>{{theJob.charged}}</h5>
                <h5>{{theJob.jobStatus}}</h5>
                <h5>{{theJob.invoiced}}</h5>
                <h5>{{theJob.clientId}}</h5>
                <p>{{theJob.notes}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import router from '../router'
import cookies from 'vue-cookies'
import NavBar from '../components/NavBar.vue'
import AsideBar from '../components/AsideBar.vue'

    export default {
        name: "Jobs",
        props:["jobId"],
        components: {
            NavBar,
            AsideBar,
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

                    if (this.jobId != undefined) {
                        axios.request({
                            url: process.env.VUE_APP_API_SITE+'/api/jobs',
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'sessionToken': this.token
                            },
                            params: {
                                "jobId": this.jobId
                            }
                        }).then((response) => {
                            this.theJob = response.data[0]
                            console.log(this.theJob);
                        }).catch((error) => {
                            console.log(error + ' error');
                        })
                    }
                }
            }
        },
        data() {
            return {
                user: '',
                token: '',
                userId: 0,
                theJob: {},
                searchInput: '',
                searchedArray: [],
            }
        },
        methods: {
            searchJobs() {
                if (this.searchInput != '') {
                    console.log("Empty function @ jobs vue");
                    //Search Algo
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
            getJob(jobId) {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/jobs',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                    params: {
                        "jobId": jobId
                    }
                }).then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.log(error + ' error');
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    #jobsPage {
        width: 100vw;
        min-height: 100%;
        height: fit-content;
        background-color: #f5fffd;

        #jobSearch {
            background-color: #2b6777;
            margin-top: 56px;
            color: whitesmoke;

            h1, #searchElements, #searchBtn {
                margin-left: 2vw;
            }

            #searchElements {
                width: 80%;
            }

            #searchBtn {
                margin: 0 0 1vh 2vw;

            }
        }

        #jobsContainer {
            height: fit-content;
            width: 100%;
            display: grid;

            #noJobMsg {
                justify-self: center;
                margin-top: 10vh;
                color: #ff4e44;
                text-align: center;
            }
        }
    }

    @media screen and (min-width: 700px) { 
    }

    @media screen and (min-width: 1100px) { 
        #jobsPage {
            display: grid;
            grid-template-columns: 10% 90%;
            grid-template-rows: 20% 80%;

            #asideBar {
                grid-column: 1;
                position: fixed;
                width: 10%;
            }

            #jobSearch {
                margin-top: 0;;
                grid-row: 1;
                grid-column: 2;
            }

            #jobsContainer {
                grid-row: 2;
                grid-column: 2;
                margin-top: 0;
            }

            #toolBar {
                height: 80px;
            }
        }
    }
</style>