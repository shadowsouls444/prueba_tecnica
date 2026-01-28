<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{

    // Obtener tareas
    public function getAll(Request $request)
    {
        $tasks = Task::with('user')->get();

        if(!$tasks){
            return response()->json([ 'message' => 'Tasks not found' ], 404);
        } 

        return response()->json($tasks, 200);
    }

    // Crear tarea
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required|max:500',
            'user' => 'required|max:500',
        ]);

        $user = User::where('email',$validated['user'])->first();

        if(!$user){
            return response()->json([ 'message' => 'User not found' ], 404);
        }

        $task = new Task($validated);
        $task->user_id = $user->id;
        $task->save();

        $task->load('user');

        return response()->json($task, 200);
    }

    // Actualizar tarea
    public function update(Request $request, $id)
    {

        $validated = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required|max:500',
            'completed' => 'boolean'
        ]);

        $task = Task::find($id);

        if(!$task) {
            return response()->json([ 'message' => 'Task not found' ], 404);
        }

        // Corrección: Se actualiza la tarea con datos validados.
        $task->update($validated);
        $task->load('user');

        return response()->json($task, 200);
    }

    // Eliminar tarea
    public function destroy($id)
    {
        $task = Task::find($id);

        if(!$task) {
            return response()->json([ 'message' => 'Task not found' ], 404);
        }

        $task->delete();

        return response()->json([ 'message' => 'Tasks deleted sucessfully' ], 201);
    }
}
