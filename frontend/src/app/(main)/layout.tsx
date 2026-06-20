"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { HeaderNavigation } from "@/navigations/header";
import { AccountProvider } from "@/providers/account-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const header = HeaderNavigation.find((i) => i.path(pathname))!;

  return (
    <SidebarProvider>
      <AccountProvider>
        <AppSidebar />
        <SidebarInset>
          {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"> */}
          {/*   <div className="flex items-center gap-2 px-4"> */}
          {/*     <SidebarTrigger className="-ml-1" /> */}
          {/*   </div> */}
          {/* </header> */}
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div
              className="flex gap-4 items-center text-bungur"
              onClick={
                header.title == "Detail Rak"
                  ? () => router.push("/library/rack")
                  : undefined
              }
            >
              <header.icon width={50} height={50} />
              <div className="flex flex-col gap-2">
                <div className="text-2xl font-bold">{header.title}</div>
                {header.sub ?? <div className="text-lg">{header.sub}</div>}
              </div>
            </div>
            {children}
          </div>
        </SidebarInset>
      </AccountProvider>
    </SidebarProvider>
  );
}
