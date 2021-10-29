<template>
    <div>
        <div id="toolBar">
            <div id="sortByContainer">
                <!--Dynamic menu changes options based on view-->
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
                        width="100%"
                        height= "100%"
                        color="#52ab98"
                        >
                        Sort {{sortType}}
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
            <h4 id="toolViewTitle">View {{sortType}} by:</h4>
            <!--If on schedule view, show this-->
            <div id="jobStatusContainer" v-if="view == 'schedule'">
                <v-btn
                    id="activeBtn"
                    width="90%"
                    height= "60%"
                    color="#24a0ed"
                    @click="emitActiveFilter"
                    >
                    Active
                </v-btn>
                <v-btn
                    id="completedBtn"
                    width="90%"
                    height= "60%"
                    color="#4AC948"
                    @click="emitCompletedFilter"
                    >
                    Complete
                </v-btn>
                <v-btn
                    v-if="user.authLevel == 'manager' || user.authLevel == 'admin'"
                    id="archivedBtn"
                    width="90%"
                    height= "60%"
                    color="#ff3333"
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
        name: "Toolbar",
        props: ["user", "view"],
        beforeMount() {
            if (this.view == "schedule") {
                this.sortBoxItems = ["All", "Scheduled Date", "Job Status", "Client", "Job Name"];
                this.sortType = "jobs"
            }
        },
        data() {
            return {
                sortValue: undefined,
                sortBoxItems: [],
                sortType: '',
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
            background-color: #f5fffd;
            border-radius: 10px;
            margin-top: 1vh;
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

    @media screen and (min-width: 700px) {
        #toolBar {
            margin-top: 68px;
        }
    }

    @media screen and (min-width: 1100px) {
        #toolBar {
            margin-top: 0;
            height: 120px;
        }
    }
</style>