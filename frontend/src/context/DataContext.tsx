import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Typ danych, które przechowuje kontekst
interface Data {
  // Przykładowa struktura danych, dostosuj ją do rzeczywistych danych
  id: number;
  name: string;
  price: number;
}

type DataContextType = Data[] | null; // Dane mogą być tablicą obiektów lub null

// Tworzenie kontekstu z typami
export const DataContext = createContext<DataContextType>(null);

// Typ dla właściwości komponentu DataProvider
interface DataProviderProps {
  children: ReactNode; // ReactNode to dowolny renderowalny element React
}

export function DataProvider({ children }: DataProviderProps) {
  const [data, setData] = useState<DataContextType>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/products');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result: Data[] = await response.json(); // Zakładamy, że wynik jest tablicą obiektów typu Data
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
}
