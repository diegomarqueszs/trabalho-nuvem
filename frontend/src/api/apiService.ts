import { format } from "date-fns";
import { toast } from "sonner";
import { Consumer } from "./consumer";

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getConsumers(): Promise<Consumer[]> {
  const res = await fetch(`${API_BASE_URL}/clientes/`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const data: Consumer[] = await res.json();
  return data;
}

export async function updateConsumer(consumer: Consumer): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/clientes/${consumer.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consumer),
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      if (res.status === 404) {
        toast.error("Consumer not found!", {
          description: "The consumer you're trying to update does not exist.",
        });
      } else if (res.status === 400) {
        toast.error("Invalid data!", {
          description: errorMessage,
        });
      } else {
        toast.error("Update failed!", {
          description: `HTTP error! Status: ${res.status}`,
        });
      }
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    toast.success("Consumer updated successfully!", {
      description: consumer.nome,
      richColors: true,
      className: 'bg-green-500 text-slate-100',
      duration: 700,
    });

  } catch (error) {
    console.error("Error updating consumer:", error);
    // Optionally, handle additional cleanup or logging here
  }
}

export async function deleteConsumer(
  id: number,
  nome: string,
): Promise<void> {

  const res = await fetch(`${API_BASE_URL}/clientes/${id}/`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  toast.info("Usuário deletado com sucesso!", {
    description: nome,
    richColors: true,
    className: 'bg-red-500 text-slate-100',
    duration: 700,
  });

}


export async function createConsumer(consumer: Consumer): Promise<void> {
  try {
    const formattedConsumer = {
      ...consumer,
      data_nascimento: consumer.data_nascimento 
        ? format(new Date(consumer.data_nascimento), 'yyyy-MM-dd') 
        : '',
    };

    const res = await fetch(`${API_BASE_URL}/clientes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedConsumer),
    });

    if (res.status === 422 || res.status === 400) { 
      toast.error("Usuário já existe!", {
        description: `O usuário ${consumer.nome} já está cadastrado.`,
        richColors: true,
        className: 'bg-yellow-500 text-slate-100',
        duration: 700,
      });
      return;
    }

    if (!res.ok) {
      toast.error(`Erro ao criar usuário. Status: ${res.status}`, {
        richColors: true,
        className: 'bg-red-500 text-slate-100',
        duration: 700,
      });
      return;
    }

    toast.success("Usuário criado com sucesso!", {
      description: consumer.nome,
      richColors: true,
      className: 'bg-green-500 text-slate-100',
      duration: 700,
    });
    
  } catch (error) {
    toast.error("Erro na solicitação.", {
      description: "Houve um problema ao tentar criar o usuário.",
      richColors: true,
      className: 'bg-red-500 text-slate-100',
      duration: 700,
    });
    console.error("Failed to create consumer:", error);
  }
}

