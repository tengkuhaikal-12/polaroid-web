<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PhotoEditorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('camera/PhotoEditor');
    }
}