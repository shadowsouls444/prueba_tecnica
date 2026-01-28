<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Task List</h1>
        <ul class="list-group mb-4">

            <div class="filters mb-3">
                <button @click="filterTask('todos')" class="btn btn-secondary btn-sm">Todos</button>
                <button @click="filterTask('completado')" class="btn btn-success btn-sm">Completado</button>
                <button @click="filterTask('pendiente')" class="btn btn-warning btn-sm">Pendiente</button>
            </div>

            <li v-for="task in tasks" :key="task.id"
                class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-1">{{ task.title }}</h5>
                    <p class="mb-1">{{ task.description }}</p>
                    <small class="text-muted">Assigned to: {{ task.user.name }}</small>
                </div>
                <div>
                    <button v-if="!task.completed" class="btn btn-success btn-sm mr-2" @click="completeTask(task)">Complete</button>
                    <span v-else>Task completed</span>
                    <button class="btn btn-danger btn-sm" @click="deleteTask(task.id)">Delete</button>
                </div>
            </li>
        </ul>
        <form @submit.prevent="addTask" class="card card-body">
            <div class="form-group">
                <input v-model="newTask.title" class="form-control" placeholder="Task Title" required>
            </div>
            <div class="form-group">
                <input v-model="newTask.description" class="form-control" placeholder="Task Description" required>
            </div>
            <div class="form-group">
                <input v-model="newTask.user" class="form-control" placeholder="Assigned User" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Add Task</button>
        </form>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters  } from 'vuex';

export default {
    data() {
        return {
            newTask: {
                title: '',
                description: '',
                user: ''
            }
        };
    },
    computed: {
        ...mapGetters(['tasks']) // Simplificado para mapState
    },
    methods: {
        ...mapActions(['fetchTasks', 'addTask', 'completeTask', 'deleteTask']),
        addTask() {
            if (!this.newTask.title || !this.newTask.description || !this.newTask.user) {
                alert('Both title and description are required');
                return;
            }

            // Se utiliza la acción 'addTask' y luego se limpia el formulario
            this.$store.dispatch('addTask', this.newTask).then(() => {
                this.newTask.title = '';
                this.newTask.description = '';
                this.newTask.user = '';
            }).catch(error => {
                console.error('Error adding task:', error);
            });
        },
        completeTask(task) {

            const updateTask = { id: task.id, title: task.title, description: task.description, completed: 1 }

            // Se utiliza la acción 'completeTask'
            this.$store.dispatch('updateTask', updateTask).catch(error => {
                console.error('Error completing task:', error);
            });
        },
        deleteTask(taskId) {
            // Se utiliza la acción 'deleteTask'
            this.$store.dispatch('deleteTask', taskId).catch(error => {
                console.error('Error deleting task:', error);
            });
        },
        filterTask(filter){
            this.$store.dispatch('addFilter',filter).catch(error => {
                console.error('Error: ', error)
            })
        }
    },
    mounted() {
        this.$store.dispatch('getTasks');
    }
};
</script>
