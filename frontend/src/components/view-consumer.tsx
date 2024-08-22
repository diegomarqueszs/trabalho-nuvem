import { Consumer } from "@/api/consumer";
import { Calendar, IdCard, Mail, User } from "lucide-react";
import { DialogContent, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";

interface ViewConsumerProps {
    consumer: Consumer;
}

export function ViewConsumer({ consumer }: ViewConsumerProps) {
    return (
        <DialogContent>
            <DialogTitle className='text-2xl text-center'>
                Visualizar dados
            </DialogTitle>

            <div className='space-y-6'>
                <div className='flex items-center gap-2 '>
                    <IdCard size={16} />
                    <Label htmlFor="id">ID:</Label>
                    <div className=''>{consumer.id}</div>
                </div>
                <div className='flex items-center gap-2'>
                    <User size={16} />
                    <Label htmlFor="nome">Nome:</Label>
                    <div className=''>{consumer.nome}</div>
                </div>

                <div className='flex items-center gap-2'>
                    <IdCard size={16} />
                    <Label htmlFor="cpf">CPF:</Label>
                    <div className=''>{consumer.cpf}</div>
                </div>

                <div className='flex items-center gap-2'>
                    <Mail size={16} />
                    <Label htmlFor="email">E-mail:</Label>
                    <div className=''>{consumer.email}</div>
                </div>

                <div className='flex items-center gap-2'>
                    <Calendar size={16} />
                    <Label htmlFor="data_nascimento">Data de nascimento:</Label>
                    <div className=''>
                        {consumer.data_nascimento ?
                            new Date(consumer.data_nascimento).toLocaleDateString()
                            : 'N/A'}
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
