<template>
    <div id="toolBar">
        <div id="sortByContainer">
            <v-menu
                id="menu"
                bottom
                origin="center center"
                transition="scale-transition"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    id="sortBtn"
                    v-bind="attrs"
                    v-on="on"
                    >
                    Sort options
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item
                    id="list"
                    v-for="(item, i) in sortBoxItems"
                    :key="i"
                    @click="emitSortFilter(item)"
                    >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div id="createClientContainer" v-if="user.authLevel == 'manager' || user.authLevel == 'admin'">
            <v-btn
                id="createBtn"
                @click="emitOverlayOpenToClientsView"
                >
                Create New Client
            </v-btn>
        </div>
        <div id="desktopDividerCSS"></div>
        <h4 id="toolViewTitle">Filter Position: </h4>
        <div id="clientStatusContainer">
            <v-btn
                id="assignedBtn"
                color="#52ab98"
                @click="emitAssignedFilter"
                >
                Active Clients
            </v-btn>
            <v-btn
                id="pastBtn"
                color="#52ab98"
                @click="emitPastFilter"
                >
                Past Clients
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ClientToolbar",
        props: ["user"],
        data() {
            return {
                sortBoxItems: ["All (Sorted By Name)", "ID", "Company"],
            }
        },
        methods: {
            //emits assigned clients filter type up to users view
            emitAssignedFilter() {
                this.$emit("filterClients", "active")
            },
            //emits past clients filter type up to users view
            emitPastFilter() {
                this.$emit("filterClients", "past")
            },
            //sends emit to same listener as status filter, but passes item name instead
            emitSortFilter(item) {
                this.$emit("filterClients", item)
            },
            emitOverlayOpenToClientsView() {
                this.$emit("createClient")
            }
        }
    }
</script>

<style lang="scss" scoped>
    #toolBar {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 50% 50%;
        grid-template-columns: 30% 70%;

        #sortByContainer {
            grid-column: 1;
            grid-row: 1;
            width: 30vw;
            background-color: #2b6777;
            margin-top: 1vh;
            margin-left: 1vw;

            #sortBtn {
                font-size: 1.2em;
                height: 100%;
                background-color: #63b9a7;
                color: rgb(255, 255, 255);
            }
        }

        #createClientContainer {
            grid-column: 2;
            grid-row: 1;
            justify-self: end;
            align-self: center;
            height: 70%;
            margin-right: 2vw;
                
            #createBtn {
                background-color: #f47174;
                color: whitesmoke;
                font-size: 1.2em;
            }
        }

        #desktopDividerCSS {
            display: none;
        }

        #clientStatusContainer {
            grid-column: 2;
            grid-row: 2;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 50% 50%;
            align-items: center;
            justify-items: center;

            #assignedBtn, #pastBtn {
                width: 90%;
                height: 60%;
                color: whitesmoke;
                font-size: 0.7em;
            }
        }

        #toolViewTitle {
            grid-row: 2;
            grid-column: 1;
            align-self: center;
            justify-self: center;
            font-size: 0.9em;
        }
    }

    @media screen and (max-width: 550px) {
        #toolBar {
            #sortByContainer {
                #sortBtn {
                    font-size: 0.7em;
                }
            }

            #createClientContainer { 
                #createBtn {
                    font-size: 0.7em;
                }
            }
        }
    }

    @media screen and (min-width: 700px) {
        #toolBar {

            #sortByContainer {
                margin-left: 2vw;
            }

            #clientStatusContainer {
                #assignedBtn, #pastBtn {
                    width: 70%;
                    font-size: 1em;
                }
            }

            #toolViewTitle {
                font-size: 1.3em;
            }
        }
    }

    @media screen and (min-width: 1100px) {
        #toolBar {
            grid-template-columns: 15% 1% 15% 30% 39%;
            grid-template-rows: 100%;

            #sortByContainer {
                grid-row: 1;
                grid-column: 1;
                width: 90%;
                height: 50%;
                justify-self: center;
                align-self: center;
                margin-right: 1vw;

                #sortBtn {
                    width: 100%;
                    font-size: 1em;
                }
            }

            #createClientContainer {
            grid-column: 5;
        }

            #desktopDividerCSS {
                display: inline-block;
                width: 10%;
                height: 80%;
                background-color: white;
                align-self: center;
                justify-self: center;
            }

            #clientStatusContainer {
                grid-row: 1;
                grid-column: 4;
                
                #assignedBtn, #pastBtn {
                    width: 90%;
                    height: 50%;
                    margin-top: 1vh;
                }
            }

            #toolViewTitle {
                justify-self: center;
                margin-top: 1vh;
                grid-row: 1;
                grid-column: 3;
            }
        }
    }
</style>