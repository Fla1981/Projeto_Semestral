<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadAnexoRequest;
use App\Models\Recado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class RecadoController extends Controller
{
    // ---------- CRUD do usuário logado ----------

    public function index()
    {
        return Recado::where('user_id', Auth::id())->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'texto' => 'required|string',
        ]);

        $validated['user_id'] = Auth::id();

        return response()->json(Recado::create($validated), 201);
    }

    public function show(string $id)
    {
        return Recado::where('user_id', Auth::id())->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $recado = Recado::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'texto' => 'required|string',
        ]);

        $recado->update($validated);

        return $recado;
    }

    public function destroy(string $id)
    {
        $recado = Recado::where('user_id', Auth::id())->findOrFail($id);

        $this->apagar($recado);

        return response()->json(['message' => 'Recado excluído com sucesso!']);
    }

    // Moderação: o admin exclui o recado de qualquer usuário
    public function destroyAdmin(Recado $recado)
    {
        $this->apagar($recado);

        return response()->json(['message' => 'Recado excluído com sucesso!']);
    }

    // Apaga o registro e, depois, o anexo do Storage
    private function apagar(Recado $recado): void
    {
        $caminhoAnexo = $recado->anexo_path;

        $recado->delete();

        if ($caminhoAnexo) {
            Storage::delete($caminhoAnexo);
        }
    }
        // ---------- Moderação (rota protegida por can:admin) ----------

    // Lista os recados de todos os usuários, com o nome do autor
    public function todos()
    {
        return Recado::with('user:id,name')->latest()->get();
    }

    // ---------- Anexos ----------

    public function storeAnexo(UploadAnexoRequest $request, Recado $recado)
    {
        // Um anexo por recado: se já existe, apaga o antigo
        if ($recado->anexo_path) {
            Storage::delete($recado->anexo_path);
        }

        $arquivo = $request->file('anexo');

        $recado->update([
            'anexo_path' => $arquivo->store('anexos'), // disco privado, nome aleatório
            'anexo_nome' => $arquivo->getClientOriginalName(),
        ]);

        return response()->json(['anexo_nome' => $recado->anexo_nome], 201);
    }

    public function showAnexo(Recado $recado)
    {
        Gate::authorize('baixarAnexo', $recado);

        if (! $recado->anexo_path || ! Storage::exists($recado->anexo_path)) {
            return response()->json(['message' => 'Este recado não possui anexo.'], 404);
        }

        return Storage::download($recado->anexo_path, $recado->anexo_nome);
    }
}
