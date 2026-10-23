<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadAnexoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('anexar', $this->route('recado'));
    }

    public function rules(): array
    {
        return [
            'anexo' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'], // 5 MB
        ];
    }

    public function messages(): array
    {
        return [
            'anexo.required' => 'Selecione um arquivo.',
            'anexo.mimes'    => 'O anexo deve ser uma imagem (jpg, png, webp) ou um PDF.',
            'anexo.max'      => 'O anexo pode ter no máximo 5 MB.',
        ];
    }
}