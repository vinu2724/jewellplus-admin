// import { useClient } from "@/context/ClientContext";
import { useClient } from "@/context/ClientContext";
import { useState, useEffect } from "react";

export interface User {
  User_Code: string;
  User_Name: string;
  User_Id: string;
}

const useUserList = () => {
  const { clientData } = useClient();
  const [users, setUsers] = useState<string[]>([]);
  const [dropDown, setDropDown] = useState<User[]>([]);
  const [Userloading, setUserLoading] = useState<boolean>(true);
  const [Usererror, setUserError] = useState<string | null>(null);
  const dbUrl = `${clientData?.DbServerName}#${clientData?.DbName}`;

  useEffect(() => {
    const fetchUsers = async () => {
      setUserLoading(true);
      setUserError(null);

      try {
        const response = await fetch("/api/dddw_user_list", {
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

        const data: User[] = await response.json();

        // Always trim and normalize User_Name for matching
        const deliveryBy: User[] = data.map((deliver) => ({
          User_Code: deliver.User_Code,
          User_Name: deliver.User_Name.trim(),
          User_Id: deliver.User_Id,
        }));

        setDropDown(deliveryBy);

        const formattedUser: string[] =
          data.length > 0 ? data.map((user) => user.User_Name.trim()) : [];

        setUsers(formattedUser);
      } catch (Usererror) {
        console.log("Error fetching customers:", Usererror);
        setUserError("Failed to load users");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUsers();
  }, [dbUrl]);

  return { users, Userloading, dropDown, Usererror };
};

export default useUserList;
