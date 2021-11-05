<template>
    <div>
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
            <div id="desktopDividerCSS"></div>
            <h4 id="toolViewTitle">Filter {{sortType}} by:</h4>
            <!--If on schedule view, show this-->
            <div id="jobStatusContainer">
                <v-btn
                    id="activeBtn"
                    color="#24a0ed"
                    @click="emitActiveFilter"
                    >
                    Active
                </v-btn>
                <v-btn
                    id="completedBtn"
                    color="#4AC948"
                    @click="emitCompletedFilter"
                    >
                    Complete
                </v-btn>
                <v-btn
                    v-if="user.authLevel == 'manager' || user.authLevel == 'admin'"
                    id="archivedBtn"
                    color="#f47174"
                    @click="emitArchivedFilter"
                    >
                    Archive
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ScheduleToolbar",
        props: ["user"],
        data() {
            return {
                sortValue: undefined,
                sortBoxItems: ["All", "Scheduled Date", "Job Status", "Client", "Job Name"],
                sortType: 'jobs',
            }
        },
        methods: {
            //emits active job filter type up to schedule
            emitActiveFilter() {
                this.$emit("filterJobs", "active")
            },
            //emits completed job filter type up to schedule
            emitCompletedFilter() {
                this.$emit("filterJobs", "completed")
            },
            //emits archived job filter type up to schedule. Archived can only be access with valid manager or admin token
            emitArchivedFilter() {
                this.$emit("filterJobs", "archived")
            },
            //sends emit to same listener as status filter, but passes item name instead
            emitSortFilter(item) {
                this.$emit("filterJobs", item)
            }
        }
    }
</script>

<style lang="scss" scoped>
    #toolBar {
        z-index: 99;
        width: 100vw;
        height: 84px;
        position: fixed;
        margin-top: 56px;
        background-color: #2b6777;
        box-shadow: 0 3px 15px -5px black;
        color: #f5fffd;
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
                width: 100%;
                height: 100%;
                background-color: #63b9a7;
                color: rgb(255, 255, 255);
            }
        }

        #desktopDividerCSS {
            display: none;
        }

        #jobStatusContainer {
            grid-column: 2;
            grid-row: 2;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 33% 33% 33%;
            align-items: center;
            justify-items: center;

            #activeBtn, #completedBtn, #archivedBtn {
                width: 90%;
                height: 60%;
                color: whitesmoke;
            }
        }

        #toolViewTitle {
            grid-row: 2;
            grid-column: 1;
            align-self: center;
            justify-self: center;
        }
    }

    @media screen and (max-width: 400px) {
        #toolBar {
            #jobStatusContainer {
                #activeBtn, #completedBtn, #archivedBtn {
                    font-size: 0.7em;
                }
            }
        }
    }

    @media screen and (max-width: 550px) {
        #toolBar {
            #sortByContainer {
                #sortBtn {
                    font-size: 0.7em;
                }
            }
        }
    }

    @media screen and (min-width: 700px) {
        #toolBar {
            margin-top: 68px;

            #sortByContainer {
                margin-left: 1.5vw;
            }

            #jobStatusContainer {
                #activeBtn, #completedBtn, #archivedBtn {
                    width: 70%;
                }
            }

            #toolViewTitle {
                font-size: 1.2em;
            }
        }
    }

    @media screen and (min-width: 1100px) {
        #toolBar {
            margin-top: 0;
            height: 80px;
            grid-template-columns: 15% 1% 10% 30% 40%;
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
                    font-size: 1.1em;
                }
            }

            #desktopDividerCSS {
                display: inline-block;
                width: 10%;
                height: 80%;
                background-color: white;
                align-self: center;
                justify-self: center;
            }

            #jobStatusContainer {
                grid-row: 1;
                grid-column: 4;
                
                #activeBtn, #completedBtn, #archivedBtn {
                    width: 90%;
                    height: 50%;
                    margin-top: 1vh;
                    font-size: 1em;
                }
            }

            #toolViewTitle {
                justify-self: center;
                margin-top: 1vh;
                grid-row: 1;
                grid-column: 3;
                font-size: 1.1em;
            }
        }
    }
</style>