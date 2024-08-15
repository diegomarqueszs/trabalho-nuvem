'use client';

import { createConsumer } from '@/api/apiService'; // Importe a função de criação
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { DialogClose, DialogContent, DialogFooter, DialogTitle } from './ui/dialog';

const createConsumerFormSchema = z.object({
    nome: z.string().nonempty('Nome completo é obrigatório'),
    email: z.string().email('Formato de email inválido'),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato de CPF inválido'),
    // data_nascimento: z.date(),
});

type CreateConsumerFormValues = z.infer<typeof createConsumerFormSchema>;

export function CreateConsumerForm() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm<CreateConsumerFormValues>({
        resolver: zodResolver(createConsumerFormSchema),
    });

    const onSubmit = async (values: CreateConsumerFormValues) => {
        setLoading(true);
        try {
            await createConsumer(values);
            reset();
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContent>
            <DialogTitle className='text-2xl text-center'>Create Consumer</DialogTitle>
            <div className="mt-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label className="block mb-3">
                        <span className="text-sm">Full Name</span>
                        <input
                            type="text"
                            className="mt-2 block w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-200"
                            placeholder="Example: Manuel Gomes"
                            {...register('nome')}
                        />
                    </label>
                    <label className="block mb-3">
                        <span className="text-sm">Email</span>
                        <input
                            type="email"
                            className="mt-2 block w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-200"
                            placeholder="Example: manuel.gomes@example.com"
                            {...register('email')}
                        />
                    </label>
                    <label className="block mb-3">
                        <span className="text-sm">CPF</span>
                        <input
                            type="text"
                            className="mt-2 block w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-200"
                            placeholder="Example: 123.456.789-00"
                            {...register('cpf')}
                        />
                    </label>
                    {/* <label className="block mb-3">
                        <span className="text-sm">Date of Birth</span>
                        <input
                            type="date"
                            className="mt-2 block w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-200"
                            {...register('data_nascimento')}
                        />
                    </label> */}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type='button' className='w-28' variant='outline'>Cancel</Button>
                        </DialogClose>
                        <Button type='submit' className='w-28' disabled={loading}>
                            {loading ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </div>
        </DialogContent>
    );
}
