import { DataTable } from "@/components/data-table";
import { columns, Consumer } from "./consumer/columns";

async function getConsumers():Promise<Consumer[]> {
  const res = await fetch('https://66b8b8c83ce57325ac77f1f1.mockapi.io/api/consumers');
  const data = await res.json();
  return data;
}


export default async function Home() {
  const data = await getConsumers();

  return (
    <div className="h-screen flex row">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <DataTable columns={columns} data={data}/>
        </main>
      </div>
    </div>
  );
}
