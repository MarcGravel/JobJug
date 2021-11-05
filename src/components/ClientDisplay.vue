<template>
    <div id="clientDisplayPanels">
        <v-expansion-panels>
            <v-expansion-panel
            id="clientsExpand"
            >
                <v-expansion-panel-header>
                    {{client.name}} - {{client.company}}
                </v-expansion-panel-header>
                <v-expansion-panel-content id="expandContent">
                    <hr>
                    <div id="panelContainer">
                        <div id="idBox" class="boxItem">
                            <h3 class="infoTag">Client ID:</h3>
                            <h3 class="infoContent">{{client.clientId}}</h3>
                        </div>
                        <div id="nameBox" class="boxItem">
                            <h3 class="infoTag">Name:</h3>
                            <h3 class="infoContent">{{client.name}}</h3>
                        </div>
                        <div id="authBox" class="boxItem">
                            <h3 class="infoTag">Company:</h3>
                            <h3 class="infoContent">{{client.company}}</h3>
                        </div>
                        <div id="emailBox" class="boxItem">
                            <h3 class="infoTag">Address:</h3>
                            <h3 class="infoContent">{{client.address}}</h3>
                        </div>
                        <div id="rateBox" class="boxItem">
                            <h3 class="infoTag">Email:</h3>
                            <h3 class="infoContent">{{client.email}}</h3>
                        </div>
                        <div id="phoneBox" class="boxItem">
                            <h3 class="infoTag">Phone:</h3>
                            <h3 class="infoContent">{{client.phone}}</h3>
                        </div>
                        <div id="editBox" v-if="user.authLevel != 'employee'">
                            <v-btn
                                @click="editClient"
                                color="primary">
                                Edit
                            </v-btn>
                        </div>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script>
    export default {
        name: "ClientDisplay",
        props: ["user", "client"],
        methods: {
            editClient() {
                this.$emit("editClient", this.client);
            }
        }
    }
</script>

<style lang="scss" scoped>
    #clientDisplayPanels {
        width: 100%;

        #clientsExpand {
            background-color: #24a0edc7;
            color: whitesmoke;
            margin-top: 2vh;

            #expandContent {
                display: grid;
                
                hr {
                    width: 80%;
                    margin-left: 10%;
                    margin-bottom: 2vh;
                }

                .boxItem > * {
                        display: inline-block;
                    }

                .boxItem {
                    margin-bottom: 1vh;

                    .infoTag {
                        color: #2b6777;
                        margin-bottom: 1vh;
                    }

                    .infoContent {
                        margin-left: 2vw;
                    }
                }
            }
        }
    }
</style>