import { format } from "date-fns";
import { toast } from "sonner";
import { Consumer } from "./consumer";

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function getConsumers(search?: string, skip?: number, limit?: number): Promise<Consumer[]> {
  const queryParams = [];

  if (search && search?.trim().length > 0) {
    queryParams.push(`search=${search}`);
  }
  if (skip) {
    queryParams.push(`skip=${skip}`);
  }
  if (limit) {
    queryParams.push(`limit=${limit}`);
  }

  const queryString = queryParams.length ? `/busca/?${queryParams.join('&')}` : '/';
  const res = await fetch(`${API_BASE_URL}/clientes${queryString}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const data: Consumer[] = await res.json();
  return data;
}


export async function updateConsumer(consumer: Consumer): Promise<void> {
  try {
    const formattedConsumer = {
      ...consumer,
      data_nascimento: consumer.data_nascimento 
        ? format(new Date(consumer.data_nascimento), 'yyyy-MM-dd') 
        : '',
    };

    const res = await fetch(`${API_BASE_URL}/clientes/${consumer.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedConsumer),
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


export async function createConsumer(consumer: Consumer): Promise<boolean> {
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

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    toast.success("Usuário criado com sucesso!", {
      description: consumer.nome,
      richColors: true,
      className: 'bg-green-500 text-slate-100',
      duration: 700,
    });

    return true; 
    
  } catch (error: any) {
    toast.error("Erro ao criar o usuário!", {
      description: error.message || 'Erro desconhecido',
      richColors: true,
      duration: 1000,
    });
    return false; 
  }
}

