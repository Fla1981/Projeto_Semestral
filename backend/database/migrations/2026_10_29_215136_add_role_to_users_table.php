<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Define o papel padrão para novos usuários e usuários existentes.
            $table->string('role')->default('user');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove a coluna caso a migration seja revertida.
            $table->dropColumn('role');
        });
    }
};