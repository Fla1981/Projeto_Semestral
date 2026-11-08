<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $senha = env('ADMIN_PASSWORD');

        if (! $senha) {
            $this->command->warn('ADMIN_PASSWORD não definido no .env: admin não criado.');
            return;
        }

        $admin = User::firstOrNew(['email' => env('ADMIN_EMAIL', 'admin@exemplo.com')]);
        $admin->name = 'Administrador';
        $admin->password = $senha; // o cast 'hashed' do User gera o hash
        $admin->role = 'admin';
        $admin->save();
    }
}
