import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'; // Asegúrate de tener axios instalado

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        tasks: [], // Estado inicial para las tareas
        filter: 'todos'
    },
    mutations: {
        FILTER(state, filter){
            state.filter = filter
        },
        SET_TASKS(state, tasks) {
            state.tasks = tasks;
        },
        ADD_TASK(state, task) {
            state.tasks.push(task);
        },
        UPDATE_TASK(state, updatedTask) {
            const index = state.tasks.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
                Vue.set(state.tasks, index, updatedTask);
            }
        },
        DELETE_TASK(state, taskId) {
            state.tasks = state.tasks.filter(t => t.id !== taskId);
        }
    },
    actions: {
        getTasks({ commit }) {
            axios.get('/tasks')
                .then(response => {
                    commit('SET_TASKS', response.data);
                })
                .catch(error => {
                    console.error("Error adding task:", error.response.data);
                });
        },
        addTask({ commit }, task) {
            axios.post('/tasks', task)
                .then(response => {
                    commit('ADD_TASK', response.data);
                })
                .catch(error => {
                    console.error("Error adding task:", error.response.data);

                    if (error.response.status === 404) {
                        alert("El usuario ingresado no existe");
                    }
                });
        },
        updateTask({ commit }, task) {
            axios.put(`/tasks/${task.id}`, task)
                .then(response => {
                    console.log(response.data)
                    commit('UPDATE_TASK', response.data);
                })
                .catch(error => {
                    console.log(task.id, task)
                    console.error("Error updating task:", error.response.data);
                });
        },
        deleteTask({ commit }, taskId) {
            axios.delete(`/tasks/${taskId}`)
                .then(() => {
                    commit('DELETE_TASK', taskId);
                })
                .catch(error => {
                    console.error("Error deleting task:", error);
                });
        },
        addFilter({ commit }, filter){
            commit('FILTER', filter);
        }
    },
    getters: {
        tasks: state => {

            if (state.filter === 'todos') {
                return state.tasks
            }

            if (state.filter === 'completado') {
                return state.tasks.filter(task => task.completed);
            }

            if (state.filter === 'pendiente') {
                return state.tasks.filter(task => !task.completed);
            }

        }
    }
});
