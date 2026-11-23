<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['user', 'admin'])],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Já existe um usuário com este e-mail.',
            'password.min' => 'A senha deve ter no mínimo 8 caracteres.',
            'role.in' => 'O papel deve ser user ou admin.',
        ];
    }
}