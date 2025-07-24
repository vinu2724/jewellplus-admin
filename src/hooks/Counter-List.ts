// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useState, useEffect } from "react";

export interface Counter {
  code: string;
  branch_Code: string;
  name: string;
  branch_Branch_Name: string;
  flg: string;
}
interface ApiCounter {
  code: string;
  branch_Code: string;
  name: string;
  branch_Branch_Name: string;
  flg: string;
}

const useCounterList = () => {
  const { clientData } = useClient();
  const [counterDropDown, setCounterDropDown] = useState<Counter[]>([]);
  const [Counterloading, setCounterLoading] = useState<boolean>(true);
  const [Countererror, setCounterError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;
  useEffect(() => {
    const fetchUsers = async () => {
      setCounterLoading(true);
      setCounterError(null);

      try {
        const response = await fetch("/api/counter-list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            db: dbUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user list");
        }

        const data: ApiCounter[] = await response.json();

        if (!data || !Array.isArray(data) || data.length === 0) {
          // No matching categories, clear the dropdown
          setCounterDropDown([]);
        } else {
          const NewCounterList: Counter[] = data.map((CounterCategory) => ({
            code: CounterCategory.code,
            name: CounterCategory.name,
            branch_Branch_Name: CounterCategory.branch_Branch_Name,
            branch_Code: CounterCategory.branch_Code,
            flg: CounterCategory.flg,
          }));
          setCounterDropDown(NewCounterList);
        }
      } catch (Countererror) {
        console.log("Error fetching counters:", Countererror);
        setCounterError("Failed to load counters");
      } finally {
        setCounterLoading(false);
      }
    };

    fetchUsers();
  }, [dbUrl]);

  return { counterDropDown, Counterloading, Countererror };
};

export default useCounterList;
