<template>
    <!--if overlay is open, sets the hide overflow css class for job page to stop page scroll-->
    <div id="jobsPage" :class="pageOverlayFlow ? 'hideOverflow' : ''">
        <div id="navBar">
            <NavBar :user="user" />
        </div>
        <div id="asideBar">
            <AsideBar :user="user" />
        </div>
        <div id="jobSearch">
            <h1>Search Jobs</h1>
            <div id="searchElement">
                <v-autocomplete
                    v-model="assignValue"
                    :items="assignMenuNames"
                    dense
                    filled
                    dark
                    background-color="#368196"
                    hide-details
                    label="Search Jobs By Name..."
                    @keydown.enter="searchJobs(assignValue)"
                ></v-autocomplete>
            </div>
            <v-btn
                id="searchBtn"
                color="primary"
                @click="searchJobs(assignValue)">
                Search
            </v-btn>
            <v-btn
                v-if="user.authLevel == 'manager' || user.authLevel == 'admin'"
                id="createBtn"
                @click="createOverlay = !createOverlay; pageOverlayFlow = !pageOverlayFlow"
                >
                Create Job
            </v-btn>
            <div id="editBtnDiv" v-if="this.theJob != ''">
                <v-btn
                    v-if="user.authLevel == 'manager' || user.authLevel == 'admin'"
                    id="editBtn"
                    @click="editOverlay = !editOverlay; pageOverlayFlow = !pageOverlayFlow"
                    >
                    Edit Job
                </v-btn>
            </div>
        </div>
        <div id="jobsContainer">
            <h1 id="noJobMsg" v-if="jobId == undefined">Please search for a job to display.</h1>
            <div id="jobInfo" v-if="jobId != undefined">
                <h1 id="titleInfo">{{theJob.title}}</h1>
                <hr id="titleHr">
                <div id="jobIdInfo" class="infoDivs">
                    <h4 class="infoTag">
                        Job ID:
                    </h4>
                    <h3 class="infoContent">{{theJob.jobId}}</h3>
                    <hr class="midHr">
                </div>
                <div id="locationInfo" class="infoDivs">
                    <h4 class="infoTag">
                        Address:
                    </h4>
                    <h3 class="infoContent">{{theJob.location}}</h3>
                    <hr class="midHr">
                </div>
                <div id="clientInfo" class="infoDivs">
                    <h4 class="infoTag">
                        Client Name:
                    </h4>
                    <h3 class="infoContent">{{currentClient.name}}</h3>
                    <hr class="midHr">
                </div>
                <div id="assignedInfo" class="infoDivs">
                    <h4 class="infoTag">
                        Assigned to:
                    </h4>
                    <h3 class="infoContent" v-for="emp in this.assignedUserNames" :key="emp">{{emp}} </h3>
                    <hr class="midHr">
                </div>
                <div id="scheduledInfo" class="infoDivs">
                    <h4 class="infoTag">
                        Scheduled Date:
                    </h4>
                    <h3 class="infoContent">{{theJob.scheduledDate}}</h3>
                    <hr class="midHr">
                </div>
                <div id="completedInfo" class="infoDivs">
                    <h4 class="infoTag">
                        Completed On:
                    </h4>
                    <h3 class="infoContent">{{theJob.completedDate}}</h3>
                    <span v-if="this.theJob.jobStatus == 'completed'"
                        id="completedIcon"
                    ></span>
                    <hr class="midHr">
                </div>
                <div id="costInfo" class="infoDivs" v-if="user.authLevel != 'employee'">
                    <h4 class="infoTag">
                        Total Job Cost:
                    </h4>
                    <h3 class="infoContent">${{theJob.cost}}</h3>
                    <hr class="midHr">
                </div>
                <div id="costInfo" class="infoDivs" v-if="user.authLevel != 'employee'">
                    <h4 class="infoTag">
                        Invoice Total:
                    </h4>
                    <h3 class="infoContent">${{theJob.charged}}</h3>
                    <hr class="midHr">
                </div>
                <div id="costInfo" class="infoDivs" v-if="user.authLevel != 'employee'">
                    <h4 class="infoTag">
                        Invoiced:
                    </h4>
                    <div v-if="theJob.invoiced == 1" id="invoiceContent">
                        <h3 class="infoContent">Yes</h3>
                        <v-menu
                            v-model="invMenu"
                            :close-on-content-click="false"
                            :max-width="500"
                            offset-y
                            >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                id="viewInvoiceBtn"
                                color="white"
                                plain
                                dark
                                v-bind="attrs"
                                v-on="on"
                                @click="viewInvoiceSummary"
                                >
                                Invoice Summary
                                </v-btn>
                            </template>

                            <v-card id="card">
                                <v-list>
                                <v-list-item>
                                    <v-list-item-content>
                                    <v-list-item-title><b>Invoice Id:</b> {{invoiceSum.invId}}</v-list-item-title>
                                    <v-list-item-title><b>Invoice Date:</b> {{invoiceSum.invoiceDate}}</v-list-item-title>
                                    <v-divider></v-divider>
                                    <v-list-item-title><b>Subtotal:</b> {{invoiceSum.chargedAmount}}</v-list-item-title>
                                    <v-list-item-title><b>Tax:</b> {{invoiceSum.tax}}</v-list-item-title>
                                    <v-list-item-title><b>Total:</b> {{invoiceSum.grandTotal}}</v-list-item-title>
                                    <v-spacer></v-spacer>
                                    <v-list-item-title><b>Client:</b> {{invoiceSum.clientName}}</v-list-item-title>
                                    <v-list-item-title><b>Company:</b> {{invoiceSum.clientCompany}}</v-list-item-title>
                                    <v-list-item-title><b>Client e-mail:</b> {{invoiceSum.clientEmail}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                </v-list>
                                <v-divider></v-divider>
                                <v-list>
                                </v-list>
                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="error"
                                    @click="invMenu = false"
                                >
                                    Close
                                </v-btn>
                                <v-btn
                                    id="SendCopyInvBtn"
                                    @click="sendUserInvoiceCopy"
                                    color="success"
                                    >
                                    Email Me A Copy
                                </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </div>
                    <div v-else id="noInvoiceContent">
                        <h3 class="infoContent">No</h3>
                        <v-btn
                            v-if="invoiceAlert == false"
                            id="invoiceBtn"
                            :disabled="invoiceBtnDisabled"
                            @click="invoiceAlert = !invoiceAlert"
                            >
                            Invoice
                        </v-btn>
                        <v-alert
                            id="alertBox"
                            :value="invoiceAlert"
                            color="#52ab98"
                            dark
                            border="bottom"
                            icon="mdi-alert-circle-outline"
                            transition="scale-transition"
                            >
                                <h4>Please ensure all information is correct. By clicking Invoice below you will send the invoice directly to the client.</h4>
                                <v-btn
                                    id="confirmInvoiceBtn"
                                    :disabled="invoiceBtnDisabled"
                                    @click="sendInvoice"
                                    >
                                    Invoice
                                </v-btn>
                                <v-btn
                                    id="cancelInvoiceBtn"
                                    @click="invoiceAlert = !invoiceAlert"
                                    >
                                    Cancel
                                </v-btn>
                            </v-alert>
                    </div>
                    <hr class="midHr">
                </div>
                <div id="contentInfo">
                    <h4 class="infoTag">
                        Job Scope:
                    </h4>
                    <div id="contentContainer">
                        <p>{{theJob.content}}</p>
                    </div>
                    <hr class="midHr">
                </div>
                <div id="notesInfo" class="infoDivs">
                    <h4 class="infoTag">
                        Notes:
                    </h4>
                    <v-textarea 
                        id="notesContainer"
                        filled
                        auto-grow
                        v-model="theJobNotes"
                        
                        >
                        <p>{{theJob.notes}}</p>
                    </v-textarea>
                    <v-btn
                        id="notesBtn"
                        @click="addnewJobNotes"
                        >
                        Add Notes
                    </v-btn>
                </div>
                <v-btn
                    id="completeJobBtn"
                    @click="completeJob"
                    :disabled="completeBtnDisable"
                    >
                    Complete Job
                </v-btn>
            </div>
        </div>
        <v-overlay
            id="editOverlayContainer"
            :value="editOverlay"
            opacity="1"
            :absolute="absolute"
            >
            <div id="jobEdit">
                <EditJobs 
                    :job="this.theJob" 
                    :updateJobInfo="getJobInfo" @closeOverlay="editOverlay = !editOverlay; pageOverlayFlow = !pageOverlayFlow"
                    :allAssigned="this.assignedUserNames"
                    />
            </div>
        </v-overlay>
        <v-overlay
            id="createOverlayContainer"
            :value="createOverlay"
            opacity="1"
            :absolute="absolute"
            >
            <div id="jobCreate">
                <CreateJob @closeOverlay="createOverlay = !createOverlay; pageOverlayFlow = !pageOverlayFlow"/>
            </div>
        </v-overlay>
    </div>
</template>

<script>
import axios from 'axios'
import router from '../router'
import cookies from 'vue-cookies'
import NavBar from '../components/NavBar.vue'
import AsideBar from '../components/AsideBar.vue'
import EditJobs from '../components/EditJobs.vue'
import CreateJob from '../components/CreateJob.vue'


    export default {
        name: "Jobs",
        props:["jobId"],
        components: {
            NavBar,
            AsideBar,
            EditJobs,
            CreateJob,
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

                    this.loadJobNamesForSearch();

                    if (this.$store.state.userInfo != undefined) {
                        this.user = this.$store.state.userInfo;
                    } else {
                        this.loadUserData();
                    }

                    if (this.jobId != undefined) {
                        this.getJobInfo();
                        this.getAssignedUsers();
                        //loads clients to display names on jobs
                        this.loadCurrentClients();
                    }
                }
            }
        },
        data() {
            return {
                user: '',
                token: '',
                userId: 0,
                theJob: '',
                searchInput: '',
                searchedArray: [],
                invoiceBtnDisabled: true,
                theJobNotes: '',
                editOverlay: false,
                absolute: true,
                completeBtnDisable: false,
                createOverlay: false,
                assignedUsers: [],
                assignedUserNames: [],
                //variabled to activate page class that stops scroll when overlays open
                pageOverlayFlow: false,
                currentClient: '',
                invoiceAlert: false,
                assignValue: '',
                assignMenuNames: [],
                assignMenuJobIds: [],
                invoiceSum: {
                    invId: '',
                    chargedAmount: '',
                    tax: '',
                    grandTotal: '',
                    invoiceDate: '',
                    clientName: '',
                    clientCompany: '',
                    clientEmail: '',
                },
                invMenu: false,
            }
        },
        methods: {
            sendInvoice() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/invoice',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        "sessionToken": this.token,
                        "jobId": this.jobId,
                        "title": this.theJob.title,
                        "content": this.theJob.content,
                        "chargedAmount": this.theJob.charged
                    }
                }).then(() => {
                    this.invoiceAlert = !this.invoiceAlert

                    //update invoiced column in current job to true
                    axios.request({
                        url: process.env.VUE_APP_API_SITE+'/api/jobs',
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            "sessionToken": this.token,
                            "jobId": this.jobId,
                            "invoiced": "1"
                        }
                    }).then(() => {
                        this.getJobInfo();
                    }).catch((error) => {
                        console.log(error.response);
                    })
                }).catch((error) => {
                    console.log(error.response);
                })
            },
            viewInvoiceSummary() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/invoice',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                    params: {
                        'jobId': this.jobId
                    }
                }).then((response) => {
                    this.invoiceSum.invId = response.data.invId;
                    this.invoiceSum.chargedAmount = response.data.chargedAmount;
                    this.invoiceSum.tax = response.data.tax;
                    this.invoiceSum.grandTotal = response.data.grandTotal;
                    this.invoiceSum.invoiceDate = response.data.invoiceDate;
                    this.invoiceSum.clientName = response.data.clientName;
                    this.invoiceSum.clientCompany = response.data.clientCompany;
                    this.invoiceSum.clientEmail = response.data.clientEmail;
                }).catch((error) => {
                    console.log(error.response);
                })
            },
            sendUserInvoiceCopy() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/invoice',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                    params: {
                        'jobId': this.jobId,
                        'sendEmail': true
                    }
                }).then(() => {
                    this.invMenu = false;
                }).catch((error) => {
                    console.log(error.response);
                })
            },
            // DELETE ONCE COMPLETE
            sendViewInvoiceFile() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/invoice',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                    responseType: 'blob',
                    params: {
                        'jobId': this.jobId
                    }
                }).then((response) => {
                    //grabs the filename sent in content disposition. must split actual file name from return string
                    let fileName = response.headers['content-disposition'].split('filename=')[1].split(';')[0];
                    const url = URL.createObjectURL(new Blob([response.data], {type: response.data.type}));
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = fileName;
                    window.open(link);
                    URL.revokeObjectURL(link.href);
                }).catch((error) => {
                    console.log(error.response);
                })
            },
            loadJobNamesForSearch() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/jobs',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    }
                }).then((response) => {
                    for(let i = 0; i < response.data.length; i++) {
                        //assign two lists where job id and titles ahve matching index
                        this.assignMenuNames.push(response.data[i].title)
                        this.assignMenuJobIds.push(response.data[i].jobId)
                    }
                }).catch((error) => {
                    console.log(error.response);
                })
            },
            searchJobs(assignValue) {
                //check list for assigned name. Name and id lists indecies are matched
                //compare index of searched name and push id page at matching index
                for (let i = 0; i < this.assignMenuNames.length; i++) {
                    if (this.assignMenuNames[i] == assignValue) {
                        router.push('/jobs/'+this.assignMenuJobIds[i])
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
            getJobInfo() {
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
                    this.theJob = response.data[0];
                    this.theJobNotes = this.theJob.notes;

                    //format cost and charged to 2 decimal places and check for zeros
                    this.theJob.cost = (Math.round(this.theJob.cost * 100) /100).toFixed(2);
                    this.theJob.charged = (Math.round(this.theJob.charged * 100) /100).toFixed(2);

                    if (this.theJob.charged != 0.00 || this.theJob.charged == undefined) {
                        this. invoiceBtnDisabled = false;
                    }

                    if (this.theJob.jobStatus == "active") {
                        this.invoiceBtnDisabled = true;
                    }

                    if (this.theJob.jobStatus == 'completed' || this.theJob.jobStatus == 'archived') {
                        this.completeBtnDisable = true;
                    }
                }).catch((error) => {
                    console.log(error + ' error');
                })
            },
            getAssignedUsers() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/assign',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                    params: {
                        "jobId": this.jobId
                    }
                }).then((response) => {
                    this.assignedUsers = response.data;

                    //add names of users to assigned user list
                    for(let i = 0; i < this.assignedUsers.length; i++) {
                        this.assignedUserNames.push(this.assignedUsers[i].name);
                    }
                }).catch((error) => {
                    console.log(error + ' error');
                })
            },
            addnewJobNotes() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/jobs',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        'sessionToken': this.token,
                        "jobId": this.jobId,
                        "notes": this.theJobNotes
                    }
                }).then(() => {
                    this.getJobInfo();
                }).catch((error) => {
                    console.log(error.response);
                })
            },
            completeJob() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/jobs',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        'sessionToken': this.token,
                        "jobId": this.jobId,
                        "jobStatus": "completed"
                    }
                }).then(() => {
                    this.getJobInfo();
                }).catch((error) => {
                    console.log(error.response);
                })
            },
            loadCurrentClients() {
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/cliass',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': this.token
                    },
                    params: {
                        "jobId": this.jobId
                    }
                }).then((response) => {
                    if (response.data[0] == undefined) {
                        this.invoiceBtnDisabled=true;
                    }
                    if(response.data[0] != undefined) {
                        this.currentClient = response.data[0]
                    }
                    
                }).catch((error) => {
                    console.log(error.response);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

    #jobsPage.hideOverflow {
        height: 100vh;
        overflow-y: hidden;
    }

    #jobsPage {
        width: 100vw;
        min-height: 100%;
        height: fit-content;
        background-color: #f5fffd;

        #editOverlayContainer {
            display: grid;
            margin-top: 56px;
            min-height: 100%;
            height: fit-content;

            #jobEdit {
                width: 90vw;
                margin-bottom: 4vh;
            }
        }

        #createOverlayContainer {
            display: grid;
            margin-top: 56px;
            min-height: 100%;
            height: fit-content;

            #jobCreate {
                width: 90vw;
                margin-bottom: 4vh;
            }
        }

        #jobSearch {
            background-color: #2b6777;
            margin-top: 56px;
            color: whitesmoke;
            display: grid;
            grid-template-columns: 33% 33% 33%;
            grid-template-rows: 33% 33% 33%;
            align-items: center;

            h1 {
                grid-row: 1;
                grid-column: 1 / 4;
                margin: 0 0 1vh 2vw;
            }

            #searchElement {
                grid-row: 2;
                grid-column: 1 / 4;
                width: 80%;
                margin: 0 0 1vh 2vw;
            }

            #searchBtn {
                grid-row: 3;
                grid-column: 3;
                margin-right: 2vw;
                color: whitesmoke;
            }

            #createBtn {
                grid-row: 3;
                grid-column: 1;
                background-color: #63b9a7;
                margin-left: 2vw;
                color: whitesmoke;
            }

            #editBtnDiv {
                grid-row: 3;
                grid-column: 2;
                width: 100%;
                display: grid;

                #editBtn {
                background-color: #f47174;
                width: 80%;
                justify-self: center;
                color: whitesmoke;
            }
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

            #jobInfo {
                padding: 2vh 2vw 2vh 2vw;
                margin-top: 2vh;
                display: grid;

                //applies css to all children of class
                .infoDivs > * {
                    display: inline-block;
                }

                .infoTag {
                    color: #2b6777;
                    margin-bottom: 1vh;
                    font-size: 1.5em;
                }

                .infoContent {
                    margin-left: 2vw;
                }

                #titleInfo {
                    margin-bottom: 3vh;
                    justify-self: center;
                }

                #titleHr {
                    margin-bottom: 5vh;
                    width: 60%;
                    justify-self: center;
                }

                .midHr {
                    width: 95%;
                    justify-self: center;
                    margin-bottom: 2vh;
                }

                #completedInfo {
                    
                    #completedIcon {
                        width: 20px;
                        height: 20px;
                        margin-left: 3vw;
                        border-radius: 50px;
                        background-color: #4AC948;
                    }
                }

                #noInvoiceContent > *, #invoiceContent > * {
                    display: inline-block;
                }

                #noInvoiceContent {
                    #invoiceBtn {
                        margin-left: 10vw;
                        margin-bottom: 1vh;
                        background-color: #f47174;
                        color: whitesmoke;
                    }

                    #alertBox {

                        #confirmInvoiceBtn {
                            background-color: #f47174;
                            color: whitesmoke;
                            margin-right: 4vw;
                            margin-top: 2vh;
                        }

                        #cancelInvoiceBtn {
                            background-color: black;
                            color: whitesmoke;
                            margin-top: 2vh;
                        }
                    }
                }

                #invoiceContent {

                    #viewInvoiceBtn {
                        margin-left: 10vw;
                        margin-bottom: 1vh;
                        background-color: #24a0ed;
                        color: whitesmoke;
                    }
                }

                #contentInfo {
                    
                    #contentContainer {
                        padding: 0 4vw 0 4vw;
                    }
                }

                #notesInfo {
                    display: grid;

                    #notesContainer {
                        justify-self: center;
                        width: 90%;
                        min-height: 10vh;
                        height: fit-content;
                        padding: 1vh 1vw 1vh 1vw;
                        margin-bottom: 3vh;
                        background-color: white;
                        border: 1px solid black;
                        border-radius: 5px;
                    }

                    #notesBtn {
                        width: fit-content;
                        padding: 0 2vw 0 2vw;
                        background-color: #24a0ed;
                        color: whitesmoke;
                        justify-self: end;
                        margin-right: 5%;
                    }
                }
                
                #completeJobBtn {
                    justify-self: center;
                    width: 80%;
                    height: 10vh;
                    background-color: #4AC948;
                    color: whitesmoke;
                    font-size: 1.6em;
                    margin-top: 4vh;
                }
            }
        }
    }

    @media screen and (min-width: 700px) { 

        #jobsPage {

            #editOverlayContainer {
                margin-top: 68px;
            }

            #createOverlayContainer {
                margin-top: 68px;
            }

            #jobSearch {
                margin-top: 68px;

                #searchBtn {
                    width: 60%;
                    justify-self: end;
                }

                #createBtn {
                    width: 60%;
                }

                #editBtnDiv {
                    #editBtn {
                        width: 60%;
                    }
                }
            }

            #jobsContainer {
                
                #jobInfo {
                    width: 70%;
                    justify-self: center;

                    #completeJobBtn {
                        height: 8vh;
                    }

                    #noInvoiceContent {
                        #invoiceBtn {
                            margin-left: 4vw;
                        }
                    }

                    #invoiceContent {
                        #viewInvoiceBtn {
                            margin-left: 4vw;
                        }
                    }
                }
            }
        }
    }

    @media screen and (min-width: 1100px) { 
        #jobsPage {
            display: grid;
            grid-template-columns: 10% 90%;
            grid-template-rows: 20vh auto;

            #editOverlayContainer {
                margin-top: 0;

                #jobEdit {
                    width: 70vw;
                    margin-left: 5%;
                }

                    #editOverlaybackBtn {
                    width: 30%;
                    margin-left: 40%;
                }
            }

            #createOverlayContainer {
                margin-top: 0;

                #jobCreate {
                    width: 70vw;
                    margin-left: 5%;
                }
            }

            #asideBar {
                grid-column: 1;
                position: fixed;
                width: 10%;
                z-index: 99;
            }

            #jobSearch {
                margin-top: 0;;
                grid-row: 1;
                grid-column: 2;

                #searchBtn, #createBtn {
                    width: 50%;
                }

                #editBtnDiv {
                    #editBtn {
                        width: 60%;
                    }
                }
            }

            #jobsContainer {
                grid-row: 2;
                grid-column: 2;
                margin-top: 0;

                #jobInfo {

                    #completeJobBtn {
                        height: 5vh;
                    }

                    #noInvoiceContent {
                        #invoiceBtn {
                            margin-left: 2vw;
                        }
                    }

                    #invoiceContent {
                        #viewInvoiceBtn {
                            margin-left: 2vw;
                        }
                    }

                }
            }
        }
    }

    @media screen and (min-width: 1500px) { 
        #jobsPage{
            #jobsContainer {
                #jobInfo {
                    #noInvoiceContent { 
                        #alertBox {
                            margin-left: 1vw;
                        }
                    }
                }
            }
        }
    }
</style>