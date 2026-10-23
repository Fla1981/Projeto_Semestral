<?php

namespace App\Policies;

use App\Models\Recado;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RecadoPolicy
{
    // Enviar anexo: só o dono do recado
    public function anexar(User $user, Recado $recado): bool
    {
        return $user->id === $recado->user_id;
    }

    // Baixar anexo: o dono ou um admin
    public function baixarAnexo(User $user, Recado $recado): bool
    {
        return $user->id === $recado->user_id || $user->isAdmin();
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
