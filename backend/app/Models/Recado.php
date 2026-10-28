<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
class Recado extends Model
{
    // Campos permitidos para preenchimento em massa pelo Eloquent
    protected $fillable = [
        'titulo',
        'texto',
        'user_id',
        'anexo_path',
        'anexo_nome'
    ];

    protected $hidden = ['anexo_path'];
    
    // Cada recado pertence a um usuário, estabelecendo a relação entre as tabelas recados e users
    public function user(): BelongsTo
    {
        // Retorna os recados existentes do usuário autenticado
        return $this->belongsTo(User::class);
    }
}
