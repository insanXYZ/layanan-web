"use client";

import { UserDto } from "@/dto/user-dto";
import { HttpMethod, useMutationTanstack } from "@/hooks/use-tanstack";
import { createContext, ReactNode, useEffect, useState } from "react";

type AccountContextType = {
  user: UserDto | null;
  isPending: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserDto | null>>;
  refetchUser: () => void;
};

export const AccountContext = createContext<AccountContextType | undefined>(
  undefined,
);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);

  const { mutate, data, isSuccess, isPending } = useMutationTanstack(["getMe"]);

  const refetchUser = () => {
    mutate({
      url: "/me",
      body: null,
      method: HttpMethod.GET,
    });
  };

  useEffect(() => {
    refetchUser();
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data.data as UserDto);
    }
  }, [isSuccess, data]);

  return (
    <AccountContext.Provider value={{ user, isPending, setUser, refetchUser }}>
      {children}
    </AccountContext.Provider>
  );
};
