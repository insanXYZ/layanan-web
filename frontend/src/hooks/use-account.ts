import { AccountContext } from "@/providers/account-provider";
import { useContext } from "react";

export function useAccount() {
  const account = useContext(AccountContext);
  if (!account) {
    throw new Error("useAccount should be in AccountProvider");
  }
  return account;
}
