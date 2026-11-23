<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index()
    {
        return User::orderBy('name')->get(['id', 'name', 'email', 'role', 'created_at']);
    }

    public function store(StoreUserRequest $request)
    {
        $user = new User($request->safe()->only(['name', 'email', 'password']));
        $user->role = $request->validated('role');
        $user->save();

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return $user;
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $dados = $request->validated();

        // Evita o admin se tirar do próprio papel e perder o acesso
        if ($user->is($request->user()) && $dados['role'] !== 'admin') {
            return response()->json([
                'message' => 'Você não pode remover o seu próprio papel de administrador.',
            ], 422);
        }

        $user->fill($request->safe()->only(['name', 'email']));

        if (! empty($dados['password'])) {
            $user->password = $dados['password']; // o cast 'hashed' gera o hash
        }

        $user->role = $dados['role'];
        $user->save();

        return $user;
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->is($request->user())) {
            return response()->json([
                'message' => 'Você não pode excluir a sua própria conta.',
            ], 422);
        }

        // Apaga os anexos do Storage e os recados do usuário antes de removê-lo
        foreach ($user->recados()->get() as $recado) {
            if ($recado->anexo_path) {
                Storage::delete($recado->anexo_path);
            }
        }
        $user->recados()->delete();

        $user->delete();

        return response()->json(['message' => 'Usuário excluído com sucesso!']);
    }
}