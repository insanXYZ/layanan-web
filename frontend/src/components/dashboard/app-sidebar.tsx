"use client";

import { Library, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import * as React from "react";
import { HttpMethod, useMutationTanstack } from "@/hooks/use-tanstack";
import { Nav1, Nav2 } from "@/navigations";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { mutate: mutateLogout, isSuccess: isSuccessLogout } =
    useMutationTanstack(["logout"], true);

  const handleLogout = () => {
    mutateLogout({
      url: "/auth/logout",
      body: null,
      method: HttpMethod.POST,
    });
  };

  React.useEffect(() => {
    if (isSuccessLogout) {
      redirect("/login");
    }
  }, [isSuccessLogout]);

  return (
    <Sidebar className="text-white" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="/">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                  <Library className="text-primary" width={65} height={65} />
                </div>
                <div className="grid flex-1 items-center text-left text-3xl text-secondary leading-tight">
                  <div className="font-extrabold text-primary">d'Lib</div>
                </div>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {Nav1.map((item) => (
              <SidebarMenuItem className="text-white" key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url!}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            {Nav2.map((item) => (
              <SidebarMenuItem className="text-white" key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url!}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem className="text-white" key={"keluar"}>
              <SidebarMenuButton onClick={handleLogout} asChild>
                <div>
                  <LogOut />
                  <span>Keluar</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
