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
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from 'date-fns';
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "./ui/calendar";
import { DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";

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
        .transform((cpf) => cpf.replace(/[^\d]/g, '')),
    email: z.string().email('Email inválido'),
    data_nascimento: z.date({message: 'Data de nascimento inválida'}),
})

interface ProfileFormProps {
    defaultValues?: {
        id?: number;
        nome: string;
        cpf: string;
        email: string;
        data_nascimento: Date;
    };
    isEditing?: boolean;
    onClose?: () => void;
}

export function ProfileForm({ defaultValues, isEditing = false, onClose }: ProfileFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: defaultValues?.nome || "",
            cpf: defaultValues?.cpf || "",
            email: defaultValues?.email || "",
            data_nascimento: defaultValues?.data_nascimento
                ? new Date(defaultValues.data_nascimento)
                : undefined,
        },
    });

    const { fetchData } = useConsumers();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEditing) {
                const success = await updateConsumer({ ...values, id: defaultValues?.id });
                if (success && onClose !== undefined) {
                    onClose();
                }
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
            <DialogDescription/>
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
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(new Date(field.value), 'yyyy-MM-dd') 
                                                    ) : (
                                                        <span>Escolha uma data</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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
