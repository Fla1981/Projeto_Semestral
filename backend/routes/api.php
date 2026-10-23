<?php
 
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecadoController;
use App\Http\Controllers\RecadoAnexoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('recados/{recado}/anexo', [RecadoAnexoController::class, 'store']);
Route::get('recados/{recado}/anexo', [RecadoAnexoController::class, 'show']);
 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
 
    Route::get('/user', function (Request $request) {
        return $request->user()->only(['id', 'name', 'email']);
    });
 
    Route::apiResource('recados', RecadoController::class);
});
