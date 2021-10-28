<template>
    <div id="schedPage">
        <div id="navBar">
            <NavBar :user="user" />
        </div>
        <div id="asideBar">
            <AsideBar :user="user" />
        </div>
        <div id="toolBar">
            <Toolbar :user="user" />
        </div>
        <div id="schedContainer">
            <h1>Job Schedule: </h1>
            <div id="schedDisplay" v-for="job in scheduledJobs" :key="job.id">
                <ScheduleJobDisplay :job="job" />
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
import Toolbar from '../components/Toolbar.vue'
import ScheduleJobDisplay from '../components/ScheduleJobDisplay.vue'

    export default {
        name: "Home",
        components: {
            NavBar,
            AsideBar,
            Toolbar,
            ScheduleJobDisplay
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
                this.token = cookies.get("sessionToken");
                this.userId = cookies.get("userId");

                if (this.$store.state.userInfo != undefined) {
                    this.user = this.$store.state.userInfo;
                } else {
                    this.loadUserData();
                }

                //loads schedule every navigation to check for new/updated jobs
                this.loadSchedule();
            }
        },
        data() {
            return {
                user: '',
                token: '',
                userId: '',
                scheduledJobs: [],
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
        }
    }
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Raleway&family=Righteous&display=swap');

    #schedPage {
        width: 100vw;
        min-height: 100%;
        height: fit-content;
        background-color: #ffffff;

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
            grid-template-rows: 152px auto;

            #asideBar {
                grid-column: 1;
                position: fixed;
                width: 10%;
            }

            #toolBar {
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