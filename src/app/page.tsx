import { TableConsumer } from "@/components/table-consumer";

export default function Home() {
  return (
    <div className="h-screen flex row">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <TableConsumer />
        </main>
      </div>
    </div>
  );
}
