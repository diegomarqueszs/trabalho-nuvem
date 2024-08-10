import { Form } from "@/components/form";
import { Table } from "@/components/table";

export default function Home() {
  return (
    <div className="h-screen flex row">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <Table />
        </main>
        <aside className="w-96 bg-zinc-950 border-l border-zinc-700 p-6">
          <h2 className="text-lg font-semibold">Add new customer</h2>
          <Form />
        </aside>
      </div>
    </div>
  );
}
