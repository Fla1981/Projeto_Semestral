<?php

namespace App\Policies;

use App\Models\Recado;
use App\Models\User;

class RecadoPolicy
{
    // Somente o dono do recado pode enviar um anexo.
    public function anexar(User $user, Recado $recado): bool
    {
        return $user->id === $recado->user_id;
    }

    // O dono ou um administrador pode baixar o anexo.
    public function baixarAnexo(User $user, Recado $recado): bool
    {
        return $user->id === $recado->user_id
            || $user->isAdmin();
    }
}
