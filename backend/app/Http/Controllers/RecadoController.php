<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recado;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class RecadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retorna os recados existentes do usuário autenticado
        return Recado::where('user_id', Auth::id())->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'texto' => 'required|string',
        ]);
        // Define o user_id do recado como o ID do usuário autenticado
        // Isso garante que o recado seja associado ao usuário correto

        $validated['user_id'] = Auth::id();

        return Recado::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Recado::where('user_id', Auth::id())->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Localiza o recado pelo ID e pelo user_id do usuário autenticado
        $recado = Recado::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'texto' => 'required|string',
        ]);

        $recado->update($validated);

        return $recado;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $recado = Recado::where('user_id', Auth::id())->findOrFail($id);

        $caminhoAnexo = $recado->anexo_path;

        $recado->delete();

        // Apaga o arquivo depois do registro: se algo falhar aqui,
        // sobra um arquivo solto, mas nunca um recado apontando para um arquivo inexistente
        if ($caminhoAnexo) {
            Storage::delete($caminhoAnexo);
        }

        return response()->json([
            'message' => 'Recado excluído com sucesso!'
        ]);
    }
}
