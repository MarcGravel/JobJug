<template>
    <div>
        <v-form id="editForm">
            <h1 id="formTitle">Edit Job</h1>
            <v-text-field
                v-model="updJob.title"
                :rules="titleRules"
                label="Job Title"
            ></v-text-field>
            <v-text-field
                v-model="updJob.location"
                :rules="locationRules"
                label="Job Location"
            ></v-text-field>
            <v-text-field
                v-model="updJob.clientId"
                :rules="clientRules"
                label="Client Name"
            ></v-text-field>
            <v-text-field
                v-model="updJob.scheduledDate"
                :rules="schedRules"
                label="Scheduled Date YYYY-MM-DD"
            ></v-text-field>
            <v-text-field
                v-model="updJob.completedDate"
                :rules="completedDateRules"
                label="Completed Date YYYY-MM-DD"
            ></v-text-field>
            <v-text-field
                v-model="updJob.cost"
                type="number"
                label="Job Cost"
            ></v-text-field>
            <v-text-field
                v-model="updJob.charged"
                type="number"
                label="Invoice Total"
            ></v-text-field>
            <h3 id="invoicedTitle">Is Invoiced:</h3>
            <v-radio-group 
                v-model="updJob.invoiced"
                row>
                <v-radio
                    label="Yes"
                    :value="1"
                    color="success"
                    >
                </v-radio>
                <v-radio
                    label="No"
                    :value="0"
                    color="red"
                    >
                </v-radio>
            </v-radio-group>
            <h3 id="statusTitle">Job Status:</h3>
            <v-radio-group 
                v-model="updJob.jobStatus"
                row>
                <v-radio
                    label="Active"
                    value="active"
                    color="#24a0ed"
                    >
                </v-radio>
                <v-radio
                    label="Completed"
                    value="completed"
                    color="#4AC948"
                    >
                </v-radio>
                <v-radio
                    label="Archived"
                    value="archived"
                    color="#ff3333"
                    >
                </v-radio>
            </v-radio-group>
            <div id="deleteContainer">
                <h3>Delete job: (Cannot delete invoiced jobs)</h3>
                <v-btn id="deleteBtn"
                    color="error"
                    :disabled="disableDelete" 
                    @click="deleteJob">
                        Delete
                </v-btn>
            </div>
            <h3 id="assignTitle">Assign employees:</h3>
            <v-autocomplete
                v-model="assignValue"
                :items="assignMenuNames"
                dense
                filled
                label="Search Employee Name:"
            ></v-autocomplete>
            <v-btn
                id="assignBtn"
                @click="assignEmployee(assignValue)"
                >
                Assign Employee
            </v-btn>
            <h3 id="assignedEmp">Job is assigned to:</h3>
            <div id="assignedList">
                <div v-for="emp in allAssigned" :key="emp">
                    <h4 id="empName">{{emp}}</h4>
                    <v-icon 
                        id="delIcon"
                        @click="removeAssign(emp)"    
                        >
                        delete
                    </v-icon>
                </div>
            </div>
            <v-textarea
                id="contentContainer"
                filled
                auto-grow
                v-model="updJob.content"
                >
                <p>{{job.content}}</p>
            </v-textarea>

            <v-btn id="saveUpdateBtn"
                color="primary" 
                @click="sendUpdatedData()">
                    Save
            </v-btn>
        </v-form>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import axios from 'axios'
import router from '../router'

    export default {
        name: "EditJobs",
        props: ['job', 'allAssigned'],
        beforeMount() {
            this.loadAllEmployees();
            if(this.job.invoiced == 0 || this.job.invoiced == null) {
                this.disableDelete = false;
            }
        },
        data() {
            return {
                updJob: {
                    title: this.job.title,
                    location: this.job.location,
                    content: this.job.content,
                    scheduledDate: this.job.scheduledDate,
                    completedDate: this.job.completedDate,
                    cost: this.job.cost,
                    charged: this.job.charged,
                    jobStatus: this.job.jobStatus,
                    invoiced: this.job.invoiced,
                    clientId: this.job.clientId,
                    notes: this.job.notes,
                },
                titleRules: [
                    v => v.length  <= 100 || 'Max 100 characters'
                ],
                locationRules: [
                    v => v.length  <= 100 || 'Max 100 characters'
                ],
                schedRules: [
                    v => v.length  <= 10 || 'Max 10 characters'
                ],
                completedDateRules: [
                    v => v.length  <= 10 || 'Max 10 characters'
                ],
                clientRules: [
                    v => v.length  <= 60 || 'Max 60 characters'
                ],
                allEmployees: {

                },
                assignMenuNames: ["None"],
                assignedEmployee: '',
                assigned_emp_data: {

                },
                disableDelete: true,
                assignValue: '',
            }
        },
        methods: {
            loadAllEmployees() {
                let session = cookies.get('session');
                let token = session.token;

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/users',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'sessionToken': token
                    },
                }).then((response) => {
                    this.allEmployees = response.data

                    //add employee names to menu list
                    for(let i = 0; i < this.allEmployees.length; i++) {
                        this.assignMenuNames.push(this.allEmployees[i].name)
                    }

                }).catch((error) => {
                    console.log(error.response);
                })
            },
            assignEmployee(employee) {
                let session = cookies.get('session');
                let token = session.token;
                let userId;

                //getUserId
                for(let i = 0; i < this.allEmployees.length; i++) {
                    if (this.allEmployees[i].name == employee) {
                        userId = this.allEmployees[i].userId
                    }
                }
                //assign user
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/assign',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        "sessionToken": token,
                        "jobId": this.job.jobId,
                        "userId": userId
                    }
                }).then((response) => {
                    console.log(response);
                    this.allAssigned.push(employee);
                    this.$emit("updateJobInfo");
                }).catch((error) => {
                    console.log(error.response);
                })
            },
            sendUpdatedData() {
                let session = cookies.get('session');
                let token = session.token;

                //removes null values from request
                Object.keys(this.updJob).forEach((key) =>{
                    if (this.updJob[key] == null) {
                        delete this.updJob[key];
                    }
                })

                //add token to request object
                this.updJob.sessionToken = token
                //add jobId to object
                this.updJob.jobId = this.job.jobId

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/jobs',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: this.updJob
                }).then((response) => {
                    console.log(response.data[0]);
                        this.$emit("updateJobInfo");
                        this.$emit("closeOverlay");
                        router.go();
                }).catch((error) => {
                    console.log(error.response);
                })
            },
            deleteJob() {
                let session = cookies.get('session');
                let token = session.token;

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/jobs',
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        "sessionToken": token,
                        "jobId": this.job.jobId,
                    }
                }).then((response) => {
                    console.log(response);
                    this.$emit("updateJobInfo");
                    this.$emit("closeOverlay");
                    router.replace('/jobs')
                }).catch((error) => {
                    console.log(error);
                })
            },
            removeAssign(employee) {
                let session = cookies.get('session');
                let token = session.token;
                let userId

                //getUserId
                for(let i = 0; i < this.allEmployees.length; i++) {
                    if (this.allEmployees[i].name == employee) {
                        userId = this.allEmployees[i].userId
                    }
                }
                //delete user from job assignment
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/assign',
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        "sessionToken": token,
                        "jobId": this.job.jobId,
                        "userId": userId
                    }
                }).then((response) => {
                    console.log(response);
                    //remove employee from list visually
                    let emp = this.allAssigned.indexOf(employee);
                    if (emp > -1) {
                        this.allAssigned.splice(emp, 1);
                    }
                    this.$emit("updateJobInfo");
                }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    #editForm {
        width: 100%;
        text-align: center;
        display: grid;

        #formTitle {
            justify-self: center;
            color: #52ab98;
        }

        #invoicedTitle {
            text-align: start;
        }

        #statusTitle {
            text-align: start;
        }

        #deleteContainer {
            margin-bottom: 2vh;
            text-align: start;

            #deleteBtn {
                margin-top: 1vh;
            }
        }

        //back button of edit overlay is on the jobs page @ overlay
        #saveUpdateBtn {
            width: 80%;
            height: 5vh;
            justify-self: center;
        }

        #assignTitle {
            text-align: left;
            margin-top: 2vh;
            margin-bottom: 1vh;
        }

        #assignBtn {
            background-color:#52ab98;
            width: 100%;
            justify-self: end;
        }

        #assignedEmp {
            margin-top: 2vh;
            margin-bottom: 3vh;
            color: #52ab98;
            text-align: start;
        }

        #assignedList {
            margin-bottom: 5vh;
            display: grid;
            justify-items: start;

            h4 {
                margin: 1vh 0 1vh 3vw;
                color: #52ab98;
                display: inline-block;
            }

            #delIcon {
                color: #F47174;
                margin-left: 2vw;
                font-size: 1.3em;
            }
        }
    }

    @media screen and (min-width: 700px) {
        #editForm {
            #assignBtn {
                width: 30%;
            }
        }
    }

    @media screen and (min-width: 1100px) { 
        #editForm {

            #saveUpdateBtn {
                width: 30%;
            }

            #assignBtn {
                width: 20%;
            }
        }
    }
</style>