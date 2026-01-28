### ERRORES SOLUCIONADOS

# 1. ERROR A LA HORA DE CREAR UN REGISTRO EN LA TABLA TASKS

- El primer error que encontre fue a la hora de crear task, a continuacion paso a paso de como encontre el error y como lo solucione:

1. Primero abri la consola para ver que devolvia la respuesta de axios, la respuesta que devolvia era 500 por la url /tasks con el metodo POST

2. Primero revise por el controller task en el metodo 'store', ya que ese es la funcion del metodo post por la cual crea 'task'

3. Inicialmente no vi nada raro, asi que decidi mostrar por consola en TaskList.vue los valores que retornaba el objeto 'newTask' por el metodo addTask() y vi que eran correctos

4. Vi que solo arrojaba el error general solo arrojaba un estado 500 no daba mas detalles, asi que fui por el archivo store.js, me fui por el arreglo de actions, y en el metodo addTask() agregue esta linea por el catch --> console.error("Error adding task:", error.response.data);

Con esto me aseguro de que en la consola se muestren los datos que me devuelve Axios, específicamente el contenido de la respuesta del servidor (error.response.data), incluyendo mensajes de error, detalles de validación o excepciones, en lugar de solo recibir un estado 500 genérico.

5. Luego otra vez intento crear una tarea (task) y me sale una respuesta mas detallada en la consola especificamente en la propiedad de message:
: 
"SQLSTATE[42S02]: Base table or view not found: 1146 Table 'project.users' doesn't exist (SQL: select * from `users` where `email` = carlos@gmail.com limit 1)"

6. Revise en la BD y ejecute el comando show tables, para ver que tablas tenia una vez que me mostro las tablas ya me di cuenta del origen del error, no existia una tabla 'users' si no una tabla user, Laravel utiliza por defecto los nombres de la tabla en plural, por eso intentaba consultar users y se producía el error.

7. Entre en la carpeta database/migrations y modifique la migración de la tabla user, cambiando el nombre del schema a users (antes estaba como user). Ademas, en la migración de tasks ajuste la referencia de la clave foránea para que apunte a la tabla users

8. Ejecute el comando php artisan migrate:refresh para revertir todas las migraciones y crearlas de nuevo

9. Volvi a intentar a crear una tarea y esta vez si funciono

# 2. NO CARGA LAS TAREAS CUANDO SE INGRESA A LA PAGINA

1. Primero note que no habia un motodo en el controlador para obtener todas las tareas. Por eso cree un nuevo metodo llamado getAll() que devuelve las tareas en formato JSON, y luego configure la ruta correspondiente en routes/web.php para que llame a este método.

2. En mutations cree un nuevo metodo llamado SET_TASKS para modificar el estado inicial de la lista tasks con los datos que se le pasen.

3. En actions cree un metodo llamado getTasks, que realiza una petición GET a la URL /tasks. Al recibir respuesta de Axios, le pasamos los datos obtenidos en formato JSON como parametro a la funcion SET_TASKS para que actualize el estado inicial.

4. En TaskList.vue, especificamente en el script dentro de methods, usamos mounted() para ejecutar el metodo getTasks al cargar el componente, para que muestre todas las tareas creadas.

## 3. Error al marcar como completado una tarea

1. Cuando intento marcar una tarea como completada sale este error [vuex] unknown action type: completeTask en la consola, deduci que el metodo no existia, asi que fui al archivo store.js para verificar y encontre que el metodo que lo marca como 'completado' es updateTask

2. En TaskList.vue especificamente por this.$store.dispatch('completeTask', taskId), cambie el nombre del metodo por updateTask

3. Cuando intente de nuevo actualizar la tarea, salio error 422 en la consola, asi que supuse que era por una validacion de campos, asi que fui directamente al archivo TaskController.php

4. Me di cuenta que el objeto $validate le falta el campo completed asi que lo agregue

5. Lo probe una vez mas y no actualizo, asi que busque por la carpeta/archivo Models/Task.php para ver si tenia algun campo protegido y asi fue, agregue el campo completed $fillable para que me permita modificarlo

6. Lo probe y funciono correctamente

## CAMBIOS ADICIONALES
- Todos los métodos de los controladores ahora retornan respuestas en formato JSON, con códigos de estado HTTP apropiados según la acción realizada.

- Al crear una tarea, si el usuario asignado no existe en la base de datos, se retorna un estado 404 y se muestra un mensaje de alerta indicando que el usuario no existe.

- Se agregó una directiva v-if con v-else en la vista para que el botón "Complete" solo se muestre si la tarea está en estado pendiente.
