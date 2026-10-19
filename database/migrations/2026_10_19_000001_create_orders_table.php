<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // This project uses users as customers.
            $table->foreignId('customer_id')->constrained('users')->restrictOnDelete();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);

            // customer_addresses does not exist yet; add its FK constraints
            // when that table is introduced.
            $table->unsignedBigInteger('billing_address_id')->nullable()->index();
            $table->unsignedBigInteger('shipping_address_id')->nullable()->index();

            // Examples: checkout, paid, canceled, failed, expired.
            $table->string('status')->default('checkout')->index();
            $table->string('payment_type')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
