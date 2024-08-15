'use client';
import { getConsumers } from "@/api/apiService";
import { Consumer } from "@/api/consumer";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ConsumerContextType {
  consumers: Consumer[];
  fetchData: () => Promise<void>;
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

  const fetchData = async () => {
    try {
      const data = await getConsumers();
      setConsumers(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ConsumerContext.Provider value={{ consumers, fetchData }}>
      {children}
    </ConsumerContext.Provider>
  );
};
