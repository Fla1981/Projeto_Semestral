<?php
 
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecadoController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user()->only(['id', 'name', 'email', 'role']);
    });

    Route::apiResource('recados', RecadoController::class);
    Route::post('recados/{recado}/anexo', [RecadoController::class, 'storeAnexo']);
    Route::get('recados/{recado}/anexo', [RecadoController::class, 'showAnexo']);

    Route::middleware('can:admin')->prefix('admin')->group(function () {
        Route::get('recados', [RecadoController::class, 'todos']);
        Route::delete('recados/{recado}', [RecadoController::class, 'destroyAdmin']);
        Route::apiResource('users', UserController::class);
    });
});
