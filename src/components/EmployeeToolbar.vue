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
        <div id="createUserBtn" v-if="user.authLevel == 'manager' || user.authLevel == 'admin'">
            <v-btn
                id="createBtn"
                @click="emitOverlayOpenToUsersView"
                >
                Create Employee
            </v-btn>
        </div>
        <div id="desktopDividerCSS"></div>
        <h4 id="toolViewTitle">Filter Position: </h4>
        <div id="employeeStatusContainer">
            <v-btn
                id="adminBtn"
                color="#24a0ed"
                @click="emitAdminFilter"
                >
                Admin
            </v-btn>
            <v-btn
                id="managerBtn"
                color="#24a0ed"
                @click="emitManagerFilter"
                >
                Manager
            </v-btn>
            <v-btn
                id="employeeBtn"
                color="#24a0ed"
                @click="emitEmployeeFilter"
                >
                Employee
            </v-btn>
        </div>        
    </div>
</template>

<script>
    export default {
        name: "EmployeeToolbar",
        props: ["user"],
        data() {
            return {
                sortValue: undefined,
                sortBoxItems: ["All (sorted by name)", "ID", "Position"],
            }
        },
        methods: {
            //emits admin filter type up to users view
            emitAdminFilter() {
                this.$emit("filterUsers", "admin")
            },
            //emits manager filter type up to users view
            emitManagerFilter() {
                this.$emit("filterUsers", "manager")
            },
            //emits employee filter type up to users view
            emitEmployeeFilter() {
                this.$emit("filterUsers", "employee")
            },
            //sends emit to same listener as status filter, but passes item name instead
            emitSortFilter(item) {
                this.$emit("filterUsers", item)
            },
            emitOverlayOpenToUsersView() {
                this.$emit("createUser")
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

            #menu {
                color: black;
            }

            #sortBtn {
                font-size: 1.2em;
                width: 100%;
                height: 100%;
                background-color: #63b9a7;
                color: rgb(255, 255, 255);
            }
        }

        #createUserBtn {
            grid-column: 2;
            grid-row: 1;
            justify-self: end;
            align-self: center;
            height: 70%;
            margin-right: 2vw;
                
            #createBtn {
                background-color: #f47174;
                color: whitesmoke;
                font-size: 0.7em;
            }
        }

        #desktopDividerCSS {
            display: none;
        }

        #employeeStatusContainer {
            grid-column: 2;
            grid-row: 2;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 33% 33% 33%;
            align-items: center;
            justify-items: center;

            #adminBtn, #managerBtn, #employeeBtn {
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
        }
    }

    @media screen and (min-width: 700px) {
        #toolBar {

            #sortByContainer {
                margin-left: 2vw;
            }

            #employeeStatusContainer {
                #adminBtn, #managerBtn, #employeeBtn {
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

            #createUserBtn {
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

            #employeeStatusContainer {
                grid-row: 1;
                grid-column: 4;
                
                #adminBtn, #managerBtn, #employeeBtn {
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