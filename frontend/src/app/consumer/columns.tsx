import { deleteConsumer } from "@/api/apiService";
import { Consumer } from "@/api/consumer";
import { useConsumers } from "@/api/context";
import { ProfileForm } from "@/components/consumer-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy, Eye, MoreHorizontal, Trash, UserPen } from "lucide-react";
import { useState } from "react";

export function getColumns(): ColumnDef<Consumer>[] {
  const { fetchData } = useConsumers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);

  const handleOpenDialog = (consumer: Consumer) => {
    setSelectedConsumer(consumer);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedConsumer(null);
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="border-slate-100 active:border-slate-800"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "cpf",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CPF
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "data_nascimento",
      header: "Data de nascimento",
      cell: ({ row }) => {
        const date = new Date(row.getValue("data_nascimento"));
        const formatted = date.toLocaleDateString();
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const consumer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(consumer.cpf)}
              >
                <Copy size={22} className='w-4 h-5 mr-2' />
                Copiar CPF do cliente
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleOpenDialog(consumer)}
              >
                <Eye size={22} className='w-4 h-5 mr-2' />
                Visualizar dados do cliente
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOpenDialog(consumer)}
              >
                <UserPen size={22} className='w-4 h-5 mr-2' />
                Editar cliente
              </DropdownMenuItem>
              <DropdownMenuItem
                className="bg-red-500 text-slate-100"
                onClick={async () => {
                  await deleteConsumer(consumer.id as number, consumer.nome);
                  await fetchData();
                }}
              >
                <Trash size={22} className='w-4 h-5 mr-2' />
                Deletar cliente
              </DropdownMenuItem>
            </DropdownMenuContent>
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
              <DialogContent>
                {selectedConsumer && (
                  <ProfileForm
                    defaultValues={selectedConsumer}
                    isEditing={true}
                    onClose={handleCloseDialog}
                  />
                )}
              </DialogContent>
            </Dialog>
          </DropdownMenu>
        );
      },
    },
  ];
}
