<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('studio_collections', function (Blueprint $table) {
            $table->json('design_json')->nullable();
            $table->string('preview_path')->nullable();
            $table->string('print_file_path')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('seller_note')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('studio_collections', function (Blueprint $table) {
            $table->dropColumn([
                'design_json',
                'preview_path',
                'print_file_path',
                'submitted_at',
                'approved_at',
                'seller_note',
            ]);
        });
    }
};
