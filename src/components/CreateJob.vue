<template>
    <div>
        <v-form id="createForm" v-model="formValid">
            <h1 id="formTitle">Create New Job</h1>
            <v-text-field
                v-model="newJob.title"
                placeholder="Limit 100 characters"
                :rules="[titleRules.required, titleRules.length]"
                label="Job Title (Required)"
            ></v-text-field>
            <v-text-field
                v-model="newJob.location"
                placeholder="Limit 100 characters"
                :rules="locationRules"
                label="Job Location"
            ></v-text-field>
            <v-text-field
                v-model="newJob.clientId"
                placeholder="Clients Id number"
                type="number"
                label="Client Id"
            ></v-text-field>
            <v-text-field
                v-model="newJob.scheduledDate"
                placeholder="Must be in YYYY-MM-DD format"
                :rules="schedRules"
                label="Scheduled Date"
            ></v-text-field>
            <v-text-field
                v-model="newJob.completedDate"
                placeholder="Must be in YYYY-MM-DD format"
                :rules="completedDateRules"
                label="Completed Date"
            ></v-text-field>
            <v-text-field
                v-model="newJob.cost"
                placeholder="Must be a number"
                type="number"
                label="Job Cost"
            ></v-text-field>
            <v-text-field
                v-model="newJob.charged"
                placeholder="Must be a number"
                type="number"
                label="Invoice Total"
            ></v-text-field>
            <h4 id="invoicedTitle">Is Invoiced: (Required)</h4>
            <v-radio-group 
                v-model="newJob.invoiced"
                :rules="invoicedRules"
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
            <h4 id="statusTitle">Job Status: (Required)</h4>
            <v-radio-group 
                v-model="newJob.jobStatus"
                :rules="statusRules"
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
            <v-menu
                id="employeeMenu"
                bottom
                origin="center center"
                transition="scale-transition"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    id="assignBtn"
                    v-bind="attrs"
                    v-on="on"
                    >
                    Assign Job to Employee
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item
                    id="list"
                    v-for="(item, i) in assignMenuNames"
                    :key="i"
                    @click="assignEmployee(item)"
                    >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <h4 id="assignedEmp">Job is assigned to: {{assignedEmployee}}</h4>
            <h4 id="jobScopeTitle">Job Scope:</h4>
            <v-textarea
                filled
                auto-grow
                v-model="newJob.content"
                >
                <p>{{newJob.content}}</p>
            </v-textarea>
            <h4 id="jobNotesTitle">Notes:</h4>
            <v-textarea
                filled
                auto-grow
                v-model="newJob.notes"
                >
                <p>{{newJob.notes}}</p>
            </v-textarea>
            <v-btn id="saveUpdateBtn"
                color="primary" 
                @click="sendNewJobData()"
                :disabled="!formValid">
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
        name: "CreateJob",
        beforeMount() {
            this.loadAllEmployees();
        },
        data() {
            return {
                newJob: {
                    title: '',
                    location: '',
                    content: '',
                    scheduledDate: '',
                    completedDate: '',
                    cost: undefined,
                    charged: undefined,
                    jobStatus: '',
                    invoiced: '',
                    clientId: undefined,
                    notes: '',
                },
                allEmployees: {

                },
                assignMenuNames: ["None"],
                assignedEmployee: '',
                assigned_emp_data: {

                },
                titleRules: {
                    required: v => !!v || 'Title is required',
                    length: v => v.length  <= 100 || 'Max 100 characters'
                },
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
                invoicedRules: [
                    v => v == 1 || v == 0 || 'Must select option'
                ],
                statusRules: [
                    v => !!v || 'Must select option'
                ],
                formValid: false
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
            assignEmployee(name) {
                this.assignedEmployee = name;
            },
            sendNewJobData() {
                let session = cookies.get('session');
                let token = session.token;

                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/jobs',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        "sessionToken": token,
                        "title": this.newJob.title,
                        "location": this.newJob.location,
                        "content": this.newJob.content,
                        "scheduledDate": this.newJob.scheduledDate,
                        "completedDate": this.newJob.completedDate,
                        "cost": this.newJob.cost,
                        "charged": this.newJob.charged,
                        "jobStatus": this.newJob.jobStatus,
                        "invoiced": this.newJob.invoiced,
                        "clientId": this.newJob.clientId,
                    }
                }).then((response) => {
                    console.log(response.data[0]);

                    //add assigned employee
                    if (this.assignedEmployee != '') {
                        for (let i = 0; i < this.allEmployees.length; i++) {
                            if(this.allEmployees[i].name == this.assignedEmployee) {
                                this.assigned_emp_data = this.allEmployees[i];
                            }
                        }
                        axios.request({
                            url: process.env.VUE_APP_API_SITE+'/api/assign',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: {
                                "sessionToken": token,
                                "userId": this.assigned_emp_data.userId,
                                "jobId": response.data[0].jobId,
                            }
                        }).then(() => {
                            router.push('/jobs/'+response.data[0].jobId)
                        }).catch((error) => {
                            console.log(error.response);
                        })
                    }
                    else {
                        router.push('/jobs/'+response.data[0].jobId)
                    }
                }).catch((error) => {
                    console.log(error.response);
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    #createForm {
        display: grid;

        #formTitle {
            justify-self: center;
            color: #52ab98;
        }

        #jobScopeTitle{
            margin-bottom: 2vh;
        }

        #saveUpdateBtn {
            justify-self: center;
            width: 80%;
            height: 5vh;
        }

        #assignBtn {
            background-color:#52ab98;
        }

        #assignedEmp {
            margin-top: 2vh;
            margin-bottom: 3vh;
            color: #52ab98;
        }
    }

    @media screen and (min-width: 1100px) { 
        #createForm {

            #saveUpdateBtn {
                width: 30%;
            }
        }
    }
</style>