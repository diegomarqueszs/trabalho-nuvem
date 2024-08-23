'use client';

import { useConsumers } from "@/api/context";
import { DataTable } from "@/components/data-table";
import { SideBar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getColumns } from "./consumer/columns";

export default function Home() {
  const { consumers } = useConsumers();

  const columns = getColumns();

  return (
    <div className="h-screen flex row">
      <div className="flex flex-1">
        <aside className="mr-80">
            <SideBar />
        </aside>
        <main className="flex-1 p-6">
          <DataTable columns={columns} data={consumers} />
        </main>
        <Toaster />
      </div>
    </div>
  );
}
