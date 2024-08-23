'use client';
import { getConsumers } from "@/api/apiService";
import { Consumer } from "@/api/consumer";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ConsumerContextType {
  consumers: Consumer[];
  fetchData: () => void;
  nextPage: () => void;
  previousPage: () => void;
  hasMore: boolean;
  skip: number;
}

const ConsumerContext = createContext<ConsumerContextType | undefined>(undefined);

export const useConsumers = () => {
  const context = useContext(ConsumerContext);
  if (!context) {
    throw new Error("useConsumers must be used within a ConsumerProvider");
  }
  return context;
};

export const ConsumerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const data = await getConsumers(undefined, skip, limit + 1); // Buscando um a mais
      if (data.length > limit) {
        setHasMore(true);
        setConsumers(data.slice(0, limit)); // Exibe apenas os primeiros 10 itens.
      } else {
        setHasMore(false);
        setConsumers(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [skip, limit]);

  const nextPage = () => {
    if (hasMore) {
      setSkip((prevSkip) => prevSkip + limit);
    }
  };

  const previousPage = () => {
    if (skip > 0) {
      setSkip((prevSkip) => Math.max(prevSkip - limit, 0));
    }
  };

  return (
    <ConsumerContext.Provider value={{ consumers, fetchData, nextPage, previousPage, hasMore, skip }}>
      {children}
    </ConsumerContext.Provider>
  );
};


