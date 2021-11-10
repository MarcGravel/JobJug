<template>
    <div id="userDisplayPanels">
        <v-expansion-panels>
            <v-expansion-panel
            id="usersExpand"
            >
                <v-expansion-panel-header>
                    <!--uppercase the first letter of the auth Level-->
                    {{employee.name}} - {{employee.authLevel.charAt(0).toUpperCase()}}{{employee.authLevel.substring(1, employee.authLevel.length)}}
                </v-expansion-panel-header>
                <v-expansion-panel-content id="expandContent">
                    <hr>
                    <div id="panelContainer">
                        <div id="idBox" class="boxItem">
                            <h3 class="infoTag">Employee ID:</h3>
                            <h3 class="infoContent">{{employee.userId}}</h3>
                        </div>
                        <div id="nameBox" class="boxItem">
                            <h3 class="infoTag">Name:</h3>
                            <h3 class="infoContent">{{employee.name}}</h3>
                        </div>
                        <div id="authBox" class="boxItem">
                            <h3 class="infoTag">Role:</h3>
                            <h3 class="infoContent">{{employee.authLevel.charAt(0).toUpperCase()}}{{employee.authLevel.substring(1, employee.authLevel.length)}}</h3>
                        </div>
                        <div id="emailBox" class="boxItem">
                            <h3 class="infoTag">Email:</h3>
                            <h3 class="infoContent">{{employee.email}}</h3>
                        </div>
                        <div id="phoneBox" class="boxItem">
                            <h3 class="infoTag">Phone:</h3>
                            <h3 class="infoContent">{{employee.phone}}</h3>
                        </div>
                        <div id="rateBox" class="boxItem" v-if="user.authLevel != 'employee' || user.userId == employee.userId">
                            <h3 class="infoTag">Hourly Rate:</h3>
                            <h3 class="infoContent">{{employee.hourlyRate}}</h3>
                        </div>
                        <div id="editBox" v-if="user.authLevel != 'employee'">
                            <v-btn
                                @click="editUser"
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
        name: "UserDisplay",
        props: ["user", "employee"],
        methods: {
            editUser() {
                this.$emit("editUser", this.employee);
            }
        }
    }
</script>

<style lang="scss" scoped>
    #userDisplayPanels {
        width: 100%;

        #usersExpand {
            background-color: #52ab98;
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

    @media screen and (min-width: 700px) {
        #userDisplayPanels {

            #usersExpand {

                #expandContent {
                    
                    hr {
                        grid-column: 1 / 3;
                        grid-row: 1;
                    }

                    #panelContainer {
                        width: 100%;
                        height: fit-content;
                        display: grid;
                        grid-template-columns: 50% 50%;
                        grid-template-rows: 10% repeat(3, 25%) 15%;

                        #idBox {
                            grid-column: 1;
                            grid-row: 2;
                        }

                        #nameBox {
                            grid-column: 2;
                            grid-row: 2;
                        }

                        #authBox {
                            grid-column: 1;
                            grid-row: 3;
                        }

                        #emailBox {
                            grid-column: 2;
                            grid-row: 3;
                        }

                        #phoneBox {
                            grid-column: 1;
                            grid-row: 4;
                        }

                        #rateBox {
                            grid-column: 2;
                            grid-row: 4;
                        }

                        #editBox {
                            grid-column: 1 / 3;
                            grid-row: 5;
                            justify-self: center;
                        }
                    }
                }
            }
        }
    }
</style>