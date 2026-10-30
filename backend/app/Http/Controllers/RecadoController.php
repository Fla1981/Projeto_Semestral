<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
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
    // Localiza somente o recado pertencente ao usuário autenticado.
    $recado = Recado::where('user_id', Auth::id())->findOrFail($id);

    // Guarda o caminho do anexo antes de excluir o recado.
    $caminhoAnexo = $recado->anexo_path;

    // Exclui o registro do banco de dados.
    $recado->delete();

    // Tenta remover o arquivo associado ao recado.
    if ($caminhoAnexo) {
        try {
            $excluido = Storage::delete($caminhoAnexo);

            // Registra no log se o arquivo não foi removido.
            if (! $excluido) {
                Log::error('Não foi possível excluir o anexo do recado.', [
                    'recado_id' => $id,
                    'caminho' => $caminhoAnexo,
                ]);
            }
        } catch (\Throwable $erro) {
            // Registra detalhes técnicos da falha.
            Log::error('Erro ao excluir o anexo do recado.', [
                'recado_id' => $id,
                'caminho' => $caminhoAnexo,
                'erro' => $erro->getMessage(),
            ]);
        }
    }

    return response()->json([
        'message' => 'Recado excluído com sucesso!'
    ]);
}
}
