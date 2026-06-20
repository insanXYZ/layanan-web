"use client";

import Image from "next/image";
import ButtonEditProfile from "@/components/dashboard/profile/button-edit-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAccount } from "@/hooks/use-account";

export default function Page() {
  const { user, refetchUser } = useAccount();

  return (
    user && (
      <div className="flex flex-col gap-4 justify-center items-center p-5 border-4 rounded-xl">
        <Avatar className="w-40 h-40">
          <AvatarImage src={user.image} className="grayscale" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="font-extrabold">{user.name}</p>
        <p>{user.email}</p>
        <ButtonEditProfile user={user} />
      </div>
    )
  );
}
