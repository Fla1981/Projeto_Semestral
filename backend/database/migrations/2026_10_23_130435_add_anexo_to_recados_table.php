<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('recados', function (Blueprint $table) {
            $table->string('anexo_path')->nullable(); // caminho interno no Storage
            $table->string('anexo_nome')->nullable(); // nome original do arquivo
        });
    }

    public function down(): void
    {
        Schema::table('recados', function (Blueprint $table) {
            $table->dropColumn(['anexo_path', 'anexo_nome']);
        });
    }
};
