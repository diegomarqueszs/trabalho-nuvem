import { createConsumer, deleteConsumer, getAllConsumers } from "@/api/apiService";
import { Consumer } from "@/api/consumer";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Trash, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

function UserInfo({ name, email, avatarSrc }: { name: string; email: string; avatarSrc: string }) {
    return (
        <div className="flex flex-row gap-2 items-center">
            <Avatar>
                <AvatarImage src={avatarSrc} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <div className="text-sm font-semibold">{name}</div>
                <div className="text-sm text-muted-foreground">{email}</div>
            </div>
        </div>
    );
}

export function SideBar() {
    return (
        <Card className="fixed flex flex-col h-full">
            <CardHeader>
                <CardTitle>Controles de dados</CardTitle>
                <CardDescription>Auxilia na criação de dados para testes</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-between">
                <div className="flex flex-col gap-3">
                    <Button className="justify-start gap-2" variant="outline" onClick={
                        async () => {
                            const data = await getAllConsumers();
                            toast.loading("Limpando dados...");
                            for(const consumer of data) {
                                if(consumer.id) await deleteConsumer(consumer.id, consumer.nome, true);
                            }
                            window.location.reload();
                        }
                    }>
                        <Trash size={16} />
                        Excluir todos os clientes
                    </Button>
                    <Button className="justify-start gap-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-white" variant="outline" onClick={
                        async () => {
                            toast.loading("Mockando dados...");
                            const mockApi = await fetch("https://66b8b8c83ce57325ac77f1f1.mockapi.io/api/consumers");
                            const data: Consumer[] = await mockApi.json();
                            for(const consumer of data) {
                                await createConsumer(consumer, true);
                            }
                            window.location.reload();
                        }
                    }>
                        <UserRoundPlus size={16} />
                        Mockar dados de clientes
                    </Button>
                </div>
                <div className="flex flex-col gap-2">
                    <Separator />
                    {[
                        {
                            name: "Diego Marques",
                            email: "diego.marques1@estudante.ufla.br",
                            avatarSrc: "https://media.licdn.com/dms/image/v2/D4D03AQGW6V9GqwrmUQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1664478197404?e=1729728000&v=beta&t=vckAF0ZXmRkN8-KGL-0b27Dfxd01UKyk76ZuI3T259Q"
                        },
                        {
                            name: "Ricardo Augusto",
                            email: "ricardo.santos3@estudante.ufla.br",
                            avatarSrc: "https://media.licdn.com/dms/image/v2/D4D35AQFUp3gLCuKIuQ/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1715103562595?e=1724904000&v=beta&t=6g-4bFjLjQdPj5q1GCMj5Ndh0cys4zAUpMmt_aedNOQ"
                        },
                        {
                            name: "Breno Carvalho",
                            email: "breno.pedroso@estudante.ufla.br",
                            avatarSrc: "https://media.licdn.com/dms/image/v2/C4E03AQGpl586adCdjA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1631458892523?e=1729728000&v=beta&t=9aqhikW8f3IjT4_Jl9g8rfuvZmoLys9_r0Z7aqqFTLk"
                        }
                    ].map((user, index) => (
                        <UserInfo key={index} {...user} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
