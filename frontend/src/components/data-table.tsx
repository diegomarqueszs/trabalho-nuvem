"use client"
import * as React from "react";

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { deleteConsumer, getConsumers } from "@/api/apiService";
import { Consumer } from "@/api/consumer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UsersRound } from 'lucide-react';
import { ProfileForm } from "./consumer-form";
import { Dialog, DialogTrigger } from './ui/dialog';

interface DataTableProps {
    columns: ColumnDef<Consumer, unknown>[];
    data: Consumer[];
}

export function DataTable({
    columns,
    data: initialData,
}: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [filterValue, setFilterValue] = React.useState<string>("");
    const [data, setData] = React.useState<Consumer[]>(initialData);

    React.useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
    });

    const handleFilterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const consumers = await getConsumers(filterValue);
            setData(consumers);
        } catch (error) {
            console.error("Failed to fetch consumers:", error);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            const selectedRows = table.getSelectedRowModel().rows;
            for (const row of selectedRows) {
                const consumer = row.original;
                if(consumer && consumer.id)
                await deleteConsumer(consumer.id, consumer.nome );
            }
            const consumers = await getConsumers(filterValue);
            setData(consumers);
            setRowSelection({});
        } catch (error) {
            console.error("Failed to delete consumers:", error);
        }
    };

    const hasSelectedRows = Object.keys(rowSelection).length > 0;

    return (
        <div className='pb-6 max-w-7xl mx-auto space-y-4'>
            <div className="flex items-center gap-3">
                <UsersRound size={32}/>
                <h1 className="text-4xl font-bold text-zinc-900">Clientes</h1>
            </div>
            <div className='flex items-center justify-between'>
                <form className='flex items-center gap-2' onSubmit={handleFilterSubmit}>
                    <Input
                        placeholder="Filter names or email..."
                        value={filterValue}
                        onChange={(event) => setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                    <Button type='submit' variant={'outline'}>
                        <Search size={16} className='w-4 h-3 mr-2' />
                        Search
                    </Button>
                </form>

                {!hasSelectedRows ? ( <Dialog>
                    <DialogTrigger asChild>
                        <Button type='submit'>
                            <UserPlus size={24} className='w-4 h-5 mr-2' />
                            Novo cliente
                        </Button>
                    </DialogTrigger>
                    <ProfileForm />
                </Dialog>)

                :(<Button
                    variant="destructive"
                    disabled={!hasSelectedRows}
                    onClick={handleDeleteSelected}
                >
                    Excluir clientes
                </Button>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className='bg-gray-700'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-gray-700">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-slate-50">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sem resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Voltar
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Próximo
                </Button>
            </div>
        </div>
    );
}
