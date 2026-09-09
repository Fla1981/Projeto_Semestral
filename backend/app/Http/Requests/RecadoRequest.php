<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recado;
use Illuminate\Support\Facades\Auth;

class RecadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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

        $validated['user_id'] = Auth::id();

        return Recado::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $recado = Recado::where('user_id', Auth::id())->findOrFail($id);

        $recado->delete();

        return response()->json([
            'message' => 'Recado excluído com sucesso!'
        ]);
    }
}