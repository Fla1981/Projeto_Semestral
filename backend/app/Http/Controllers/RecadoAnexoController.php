<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadAnexoRequest;
use App\Models\Recado;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class RecadoAnexoController extends Controller
{
    public function store(UploadAnexoRequest $request, Recado $recado)
    {
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

    public function show(Recado $recado)
    {
        Gate::authorize('baixarAnexo', $recado);

        if (! $recado->anexo_path || ! Storage::exists($recado->anexo_path)) {
            return response()->json(['message' => 'Este recado não possui anexo.'], 404);
        }

        return Storage::download($recado->anexo_path, $recado->anexo_nome);
    }
}
