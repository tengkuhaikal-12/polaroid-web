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
        Schema::create('studio_photos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('studio_collection_id')
                ->constrained('studio_collections')
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('position');
            $table->string('image_path');

            // Save crop/placement settings if the editor supports them.
            $table->json('placement')->nullable();

            $table->timestamps();

            $table->unique(['studio_collection_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('studio_photos');
    }
};
