"use client"

import { createConsumer, updateConsumer } from "@/api/apiService";
import { useConsumers } from "@/api/context";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from 'date-fns';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogContent, DialogTitle } from "./ui/dialog";

// Schema for validation
const formSchema = z.object({
    nome: z.string().min(2, {
        message: "O nome deve ter no mínimo 2 caracteres.",
    }),
    cpf: z.string()
        .min(11, {
            message: "CPF deve ter 11 digitos.",
        })
        .max(11)
        .transform((cpf) => cpf.replace(/[^\d]/g, '')), // Sanitize CPF
    email: z.string().email('Email inválido'),
    data_nascimento: z.date({ message: 'Data inválida' })
})

interface ProfileFormProps {
    defaultValues?: {
        id?: number;
        nome: string;
        cpf: string;
        email: string;
        data_nascimento?: Date;
    };
    isEditing?: boolean;
}

export function ProfileForm({ defaultValues, isEditing = false }: ProfileFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: defaultValues?.nome || "",
            cpf: defaultValues?.cpf || "",
            email: defaultValues?.email || "",
            data_nascimento: defaultValues?.data_nascimento
        },
    })

    const { fetchData } = useConsumers();


    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        try {
            if (isEditing) {
                await updateConsumer({ ...values, id: defaultValues?.id });

            } else {
                const success = await createConsumer(values);
                if (success) {
                    form.reset();
                  } 
            }
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <DialogContent>
            <DialogTitle className='text-2xl text-center'>
                {isEditing ? 'Editar cliente' : 'Criar cliente'}
            </DialogTitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Manuel Gomes..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                    <Input placeholder="52476668010" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="manuel_gomes@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="data_nascimento"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de nascimento</FormLabel>
                                <FormControl>
                                    <input
                                        type="date"
                                        value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
                                            field.onChange(selectedDate);
                                        }}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">{isEditing ? 'Update' : 'Submit'}</Button>
                </form>
            </Form>
        </DialogContent>
    )
}
