<template>
    <div>
        <v-form id="editForm">
            <h3>Change any field below to update it</h3>
            <v-text-field
                v-model="job.title"
                :rules="titleRules"
                label="Job Title"
            ></v-text-field>
            <v-text-field
                v-model="job.location"
                :rules="locationRules"
                label="Job Location"
            ></v-text-field>
            <v-text-field
                v-model="job.clientId"
                :rules="clientRules"
                label="Client Name"
            ></v-text-field>
            <v-text-field
                v-model="job.scheduledDate"
                :rules="schedRules"
                label="Scheduled Date YYYY-MM-DD"
            ></v-text-field>
            <v-text-field
                v-model="job.completedDate"
                :rules="completedDateRules"
                label="Completed Date YYYY-MM-DD"
            ></v-text-field>
            <v-text-field
                v-model="job.cost"
                type="number"
                label="Job Cost"
            ></v-text-field>
            <v-text-field
                v-model="job.charged"
                type="number"
                label="Invoice Total"
            ></v-text-field>
            <h4 id="invoicedTitle">Is Invoiced:</h4>
            <v-radio-group 
                v-model="job.invoiced"
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
            <v-textarea
                filled
                auto-grow
                v-model="job.content"
                >
                <p>{{job.content}}</p>
            </v-textarea>

            <v-btn id="saveUpdateBtn"
                color="primary" 
                @click="sendUpdatedData(), overlay = !overlay">
                    Save
            </v-btn>
        </v-form>
    </div>
</template>

<script>
import cookies from 'vue-cookies'
import axios from 'axios'

    export default {
        name: "EditJobs",
        props: ['job'],
        data() {
            return {
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
            }
        },
        methods: {
            sendUpdatedData() {
                let session = cookies.get('session');
                let token = session.token;
                axios.request({
                    url: process.env.VUE_APP_API_SITE+'/api/jobs',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        'sessionToken': token,
                        "jobId": this.job.id,
                        "title": this.job.title,
                        "location": this.job.location,
                        "content": this.job.content,
                        "scheduledDate": this.job.scheduledDate,
                        "completedDate": this.job.completedDate,
                        "cost": this.job.cost,
                        "charged": this.job.charged,
                        "jobStatus": this.job.jobStatus,
                        "invoiced": this.job.invoiced,
                        "clientId": this.job.clientId,
                    }
                }).then((response) => {
                    console.log(response.data[0]);
                    this.$emit("updateJobInfo");
                }).catch((error) => {
                    console.log(error.response);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    #editForm {
        width: 100%;
        text-align: center;

        #invoicedTitle {
            text-align: start;
        }

        //back button of edit overlay is on the jobs page @ overlay
        #saveUpdateBtn {
            width: 80%;
            height: 5vh;
        }
    }

    @media screen and (min-width: 1100px) { 
        #editForm {

            #saveUpdateBtn {
                width: 30%;
            }
        }
    }
</style>