// src/components/TableConsumer.tsx
'use client';


import { Search, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '././ui/table';
import { Button } from './ui/button';
import { Dialog, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

interface CreateConsumerFormValues {
  nome: string;
  emil: string;
  cpf: string;
  data_nascimento: string;

}

export function TableConsumer() {


  const rowsPerPage = 10;
  const [data, setData] = useState<CreateConsumerFormValues[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPerPage);

  const getData = async () => {
    try {
      return;
    } catch (error) {
      return;
    }
  }
  useEffect(() => {
    getData();
  })

  return (
    <div className='p-2 mt-9 max-w-7xl mx-auto space-y-4'>
      <h1 className="text-3xl font-bold text-zinc-900">Customers</h1>
      <div className='flex items-center justify-between'>
        <form className='flex items-center gap-2'>
          <Input placeholder='Search by name, email or CPF' className='w-80' />
          <Button type='submit' variant={'outline'}>
            <Search size={16} className='w-4 h-3 mr-2' />
            Search
          </Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button type='submit' >
              <UserPlus size={24} className='w-4 h-5 mr-2' />
              New consumer
            </Button>
          </DialogTrigger>
          {/* <CreateConsumerForm></CreateConsumerForm> */}
        </Dialog>

      </div>
      <div className='border rounded-lg border-gray-700 p-2'>
        <Table>
          <TableHeader className='bg-gray-300'>
            <TableHead className='text-slate-800 font-bold'>CPF</TableHead>
            <TableHead className='text-slate-800 font-bold'>Full Name</TableHead>
            <TableHead className='text-slate-800 font-bold'>Email</TableHead>
            <TableHead className='text-slate-800 font-bold'>Date of Birth</TableHead>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => {
              return (
                <TableRow key={i} className='border-b border-slate-900'>
                  <TableCell>123.456.789-00</TableCell>
                  <TableCell>Manuel Gomes</TableCell>
                  <TableCell>manuel@gomes.com</TableCell>
                  <TableCell>1990-01-01</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      </div>
    </div>
  );
}