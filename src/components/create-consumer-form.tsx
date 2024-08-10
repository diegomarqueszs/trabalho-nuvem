// src/components/CreateConsumerForm.tsx
'use client';


import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const createConsumerFormSchema = z.object({
    fullName: z.string().nonempty(),
    email: z.string().email('Formato de email inválido'),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

type CreateConsumerFormValues = z.infer<typeof createConsumerFormSchema>;

export function CreateConsumerForm() {

    const { register, handleSubmit} = useForm<CreateConsumerFormValues>({
        resolver: zodResolver(createConsumerFormSchema),
    });

    function handleCreateConsumerForm(values: CreateConsumerFormValues) {
        console.log('values');
        console.log(values);
    }

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit(handleCreateConsumerForm)}>
                <label className="block mb-3">
                    <span className="text-sm">Full Name</span>
                    <input
                        type="text"
                        className="mt-2 block w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-50"
                        placeholder="Example: Manuel Gomes"
                        {...register('fullName')}
                    />
                </label>
                <label className="block mb-3">
                    <span className="text-sm">Email</span>
                    <input
                        type="email"
                        className="mt-2 block w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-50"
                        placeholder="Example: Manuel Gomes"
                        {...register('email')}
                    />
                </label>
                <label className="block mb-3">
                    <span className="text-sm">CPF</span>
                    <input
                        type="text"
                        className="mt-2 block w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-50"
                        placeholder="Example: Manuel Gomes"
                        {...register('cpf')}
                    />
                </label>

                <label className="block mb-3">
                    <span className="text-sm">Data of Birth</span>
                    <input
                        type="date"
                        className="mt-2 block w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-50"
                        placeholder="Example: Manuel Gomes"
                        {...register('dateOfBirth')}
                    />
                </label>

                <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-6">
                    Add customer
                </button>
            </form>
        </div>

    );
}