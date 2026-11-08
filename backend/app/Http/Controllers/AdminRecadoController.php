<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recado;

class AdminRecadoController extends Controller
{
    // Lista os recados de todos os usuários, com o nome do autor
    public function index()
    {
        return Recado::with('user:id,name')->latest()->get();
    }
}
