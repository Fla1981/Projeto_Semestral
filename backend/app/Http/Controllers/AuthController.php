<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $usuario = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Usuário cadastrado com sucesso!',
            'usuario' => $usuario
        ], 201);
    }

    public function login(Request $request)
    {
       

        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $usuario = User::where('email', $validated['email'])->first();

        if (!$usuario || !Hash::check($validated['password'], $usuario->password)) {
            return response()->json([
                'message' => 'Email ou senha inválidos.'
            ], 401);
        }
        //ao criar o token, você pode especificar um nome para ele, que pode ser útil para identificar o token posteriormente. Aqui, estamos usando 'auth_token' como nome do token.
        $token = $usuario->createToken('auth_token')->plainTextToken;
        //retorna o token para o frontend armazená-lo e utilizá-lo
        return response()->json([
            'message' => 'Login realizado com sucesso!',
            'token' => $token,
            'usuario' => $usuario
        ]);
    }
}