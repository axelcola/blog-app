import { User } from "@prisma/client";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export function useUsers() {
  const { 
    data: users,
    isLoading
  } = useSWR<User[]>("/api/users", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    users,
    isLoading
  };
}