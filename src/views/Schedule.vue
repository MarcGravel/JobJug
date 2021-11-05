<template>
    <div id="schedPage">
        <div id="navBar">
            <NavBar :user="user" />
        </div>
        <div id="asideBar">
            <AsideBar :user="user" />
        </div>
        <div id="toolBar">
            <ScheduleToolbar :user="user" @filterJobs="filterJobs"/>
        </div>
        <div id="schedContainer">
            <h1>Job Schedule: </h1>
            <div v-if="filterValue == 0">
                <div id="schedDisplay" v-for="job in scheduledJobs" :key="job.id">
                    <ScheduleJobDisplay :job="job" :allClients="allClients"/>
                </div>
            </div>
            <div v-if="filterValue == 1">
                <div id="schedDisplay" v-for="job in activeFilter" :key="job.id">
                    <ScheduleJobDisplay :job="job" :allClients="allClients"/>
                </div>
            </div>
            <div v-if="filterValue == 2">
                <div id="schedDisplay" v-for="job in archivedJobs" :key="job.id">
                    <ScheduleJobDisplay :job="job" :allClients="allClients"/>
                </div>
            </div>
        </div>
        <div id="footer">
            <PageFooter />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import router from '../router'
import cookies from 'vue-cookies'
import NavBar from '../components/NavBar.vue'
import AsideBar from '../components/AsideBar.vue'
import ScheduleToolbar from '../components/ScheduleToolbar.vue'
import ScheduleJobDisplay from '../components/ScheduleJobDisplay.vue'
import PageFooter from '../components/PageFooter.vue'

    export default {
        name: "Home",
        components: {
            NavBar,
            AsideBar,
            ScheduleToolbar,
            ScheduleJobDisplay,
            PageFooter
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

                    //loads schedule every navigation to check for new/updated jobs
                    this.loadSchedule();
                    //loads clients to display names on jobs
                    this.loadAllClients();
                }
            }
        },
        data() {
            return {
                user: '',
                token: '',
                userId: '',
                scheduledJobs: [],
                archivedJobs: [],
                activeFilter: [],
                //filter value of 0 returns no filtered schedule, 1 returns filter array, 2 returns archived jobs
                filterValue: 0,
                allClients: [],
            }
        },
        methods: {
            filterJobs(type) {
                //returns list to unfiltered main list
                if (type == "All") {
                    this.filterValue = 0;
                    //reloads schedule (check for new jobs as well as reset view to scheduledJobs property)
                    this.loadSchedule();
                }

                //filters by scheduled date, closest date first
                if (type == "Scheduled Date") {
                    // clear filter
                    this.activeFilter = [];

                    //sorting algorithm to check dates.
                    //turns string dates into date objects and then runs through array and compares scheduledDate values
                    //if value is less that other, it is placed 1 behind in the new array. and vise versa until all values checked
                    this.activeFilter = this.scheduledJobs.sort(function(a,b) {
                        let keyA = new Date(a.scheduledDate),
                            keyB = new Date(b.scheduledDate);
                        
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                    });
                    
                    //switches job display to filtered jobs with v-if
                    this.filterValue = 1;
                }

                //filters by job status. active is first, completed is second
                if (type == "Job Status") {
                    // clear filter
                    this.activeFilter = [];
                    
                    this.activeFilter = this.scheduledJobs.sort(function(a,b) {
                        let keyA = a.jobStatus,
                            keyB = b.jobStatus;
                        
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                    });

                    //switches job display to filtered jobs with v-if
                    this.filterValue = 1;
                }

                if (type == "Client") {
                    // clear filter
                    this.activeFilter = [];
                    
                    this.activeFilter = this.scheduledJobs.sort(function(a,b) {
                        let keyA = a.clientId,
                            keyB = b.clientId;
                        
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                    });

                    //switches job display to filtered jobs with v-if
                    this.filterValue = 1;
                }

                if (type == "Job Name") {
                    // clear filter
                    this.activeFilter = [];
                    
                    this.activeFilter = this.scheduledJobs.sort(function(a,b) {
                        let keyA = a.title,
                            keyB = b.title;
                        
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                    });

                    //switches job display to filtered jobs with v-if
                    this.filterValue = 1;
                }

                //filters by job status buttons in toolbar
                if (type == "active" || type == "completed") {
                    // clear filter
                    this.activeFilter = [];

                    for (let i = 0; i < this.scheduledJobs.length; i++) {
                        if(this.scheduledJobs[i].jobStatus == type) {
                            this.activeFilter.push(this.scheduledJobs[i])
                        }
                    }
                    //switches job display to filtered jobs with v-if
                    this.filterValue = 1;
                } 

                //calls for all archived jobs
                if (type == "archived") {
                    this.loadArchivedJobs();
                    //switches job display to filtered jobs with v-if
                    this.filterValue = 2;
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
                    console.log(error + ' error');
                })
            },
            loadSchedule() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/jobs',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                }).then((response) => {
                    this.scheduledJobs = response.data
                }).catch((error) => {
                    console.log(error + ' error');
                })
            },
            loadArchivedJobs() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/jobs',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                    params: {
                        'jobStatus': 'archived'
                    }
                }).then((response) => {
                    this.archivedJobs = response.data;
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
                    this.allClients = response.data;
                }).catch((error) => {
                    console.log(error.response);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway&family=Righteous&display=swap');

    #schedPage {
        width: 100vw;
        min-height: 100%;
        height: fit-content;
        background-color: #f5fffd;

        #schedContainer {
            margin-top: 140px;
            height: fit-content;

            h1 {
                font-family: 'Righteous', cursive;
                color: #2b6777;
                margin-left: 4vw;
            }
        }
    }

    @media screen and (min-width: 700px) { 
        #schedPage {

            #schedContainer {
                margin-top: 152px;
            }
        }
    }

    @media screen and (min-width: 1100px) { 
        #schedPage {
            display: grid;
            grid-template-columns: 10% 90%;
            grid-template-rows: 152px auto 10vh;

            #asideBar {
                grid-column: 1;
                position: fixed;
                width: 10%;
            }

            #toolBar {
                grid-column: 2;
                height: fit-content;
            }

            #schedContainer {
                grid-column: 2;
                margin-top: 0;

                h1 {
                    font-size: 2.5em;
                }

                #schedDisplay {
                    width: 100%;
                    height: fit-content;
                }
            }

            #pageFooter {
                grid-row: 3;
            }
        }
    }

    @media screen and (min-width: 1500px) { 
        #schedPage {
            #schedContainer {
                #schedDisplay {
                    width: 90%;
                }
            }
        }
    }
</style>