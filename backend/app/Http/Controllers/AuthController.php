<?php
 
namespace App\Http\Controllers;
 
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
 
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $dados = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);
 
        $user = User::create([
            'name' => $dados['name'],
            'email' => $dados['email'],
            'password' => Hash::make($dados['password']),
        ]);
 
        return response()->json([
            'user' => $user->only(['id', 'name', 'email']),
        ], 201);
    }
 
    public function login(Request $request)
    {
        $credenciais = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
 
        if (! Auth::attempt($credenciais)) {
            return response()->json([
                'message' => 'Credenciais inválidas',
            ], 401);
        }
 
        // Troca o ID da sessão depois do login
        $request->session()->regenerate();
 
        return response()->json([
            'user' => Auth::user()->only(['id', 'name', 'email']),
        ]);
    }
 
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
 
        // Destrói a sessão e renova o token CSRF
        $request->session()->invalidate();
        $request->session()->regenerateToken();
 
        return response()->json(['message' => 'Sessão encerrada']);
    }
}
