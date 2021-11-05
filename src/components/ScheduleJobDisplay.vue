<template>
    <div id="grid">
        <v-card
            id="container"
            elevation="8"
            >
            <!--if title length is too long, limit and add ellipses to avoid title wrapping and/or overflowing-->
            <v-card-title id="title" v-if="job.title.length > 18 ">{{job.title.substring(0,16)}}...</v-card-title>
            <v-card-title id="title" v-else>{{job.title}}</v-card-title>
            <v-btn id="viewJob" @click="navDynaJobPage">View Job</v-btn>
            <v-card-subtitle id="schedDate">Job Date: {{job.scheduledDate}}</v-card-subtitle>
            <v-card-subtitle id= "client">Client: {{getClientName}}</v-card-subtitle>
            <div id="status">
                <v-card-subtitle id="statusTag">Status: </v-card-subtitle>
                <h5 id="activeJob" v-if="job.jobStatus == 'active' ">Active</h5>
                <h5 id="completedJob" v-if="job.jobStatus == 'completed' ">Complete</h5>
                <h5 id="archivedJob" v-if="job.jobStatus == 'archived' ">Archived</h5>
            </div>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: "ScheduleJobDisplay",
        props: ["job", "allClients"],
        computed: {
            getClientName() {
                let clientName;
                for (let i = 0; i < this.allClients.length; i++) {
                    if (this.job.clientId == this.allClients[i].clientId) {
                        clientName = this.allClients[i].name;
                    }
                }
                return clientName;
            }
        },
        methods: {
            navDynaJobPage() {
                this.$router.push('/jobs/'+this.job.jobId);
            }
        }
    }
</script>

<style lang="scss" scoped>
    #grid {
        display: grid;
        justify-items: center;

        #container {
            display: grid;
            grid-template-columns: 70% 30%;
            grid-template-rows: 40% 20% 20% 20%;
            align-items: center;
            width: 95%;
            height: 20vh;
            background-color: #f5fffd;
            margin-bottom: 2vh;
            overflow: hidden;

            #title {
                grid-row: 1;
                display: inline-block;
            }

            #viewJob {
                grid-column: 2;
                grid-row: 3;
                width: fit-content;
                padding: 0 2vw 0 2vw;
                background-color: #52ab98;
                color: whitesmoke;
            }

            #schedDate {
                grid-column: 1;
                grid-row: 2;
                margin-bottom: 2vh;
            }

            #status {
                grid-column: 1 / 3;
                grid-row: 4;
                margin-bottom: 1vh;

                #statusTag {
                    display: inline-block;
                }

                h5 {
                    display: inline-block;
                    width: fit-content;
                    padding: 3px 6px 3px 6px;
                    color: whitesmoke;
                    border-radius: 20px;
                }

                #activeJob {
                    background-color: #24a0ed;
                }

                #completedJob {
                    background-color: #4AC948;
                }

                #archivedJob {
                    background-color: #ff3333;
                }
            }

            #client {
                grid-column: 1 / 3;
                grid-row: 3;
                margin-bottom: 2vh;
            }
        }
    }

    @media screen and (min-width: 500px) {
        #grid{
            #container {
                #title {
                    margin-left: 0;
                    font-size: 2em;
                }

                #viewJob {
                    font-size: 1.5em;
                    width: fit-content;
                    padding: 3vh 2vw 3vh 2vw;
                    background-color: #52ab98;
                    color: whitesmoke;
                }

                #schedDate, #status, #client {
                    margin-left: 5vw;
                    font-size: 1.5em;

                    #statusTag {
                        font-size: 1em;
                    }
                }
            }
        }
    }

    @media screen and (min-width: 1100px) {
        #grid{
            #container {
                grid-template-columns: 40% 30% 15% 15%;
                grid-template-rows: 50% 50%;
                height: 10vh;
                margin-bottom: 2vh;

                #title {
                    grid-column: 1;
                    grid-row: 1;
                }

                #viewJob {
                    grid-column: 4;
                    grid-row: 1 / 3;
                    font-size: 1em;
                    padding: 2vh 2vw 2vh 2vw;
                    align-self: center;
                }

                #schedDate {
                    grid-column: 2;
                    grid-row: 1 / 3;
                    align-self: center;
                    margin-left: 0;
                    margin-bottom: 0;
                }

                #status {
                    grid-column: 1;
                    grid-row: 2;
                    margin-left: 0;
                    margin-bottom: 0;
                }

                #client {
                    grid-column: 3;
                    grid-row: 1 / 3;
                    align-self: center;
                    margin-left: 0;
                    margin-bottom: 0;
                }
            }
        }
    }
</style>