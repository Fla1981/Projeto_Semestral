
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecadoController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas que exigem autenticação
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Recados
    Route::get('/recados', [RecadoController::class, 'index']);
    Route::post('/recados', [RecadoController::class, 'store']);
    Route::put('/recados/{recado}', [RecadoController::class, 'update']);
    Route::delete('/recados/{recado}', [RecadoController::class, 'destroy']);
});

