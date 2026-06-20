import {
  Book,
  CircleGauge,
  HandHelping,
  LucideIcon,
  ShelvingUnit,
  User,
  UserPen,
  Users,
} from "lucide-react";

interface NavigationMenuChildren {
  title: string;
  url: string;
}

export interface NavigationMenu {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  rolePermission?: string;
  childrens?: NavigationMenuChildren[];
}

export interface Navigation {
  label: string;
  navigations: NavigationMenu[];
}

export const Nav1: NavigationMenu[] = [
  {
    title: "Dashboard",
    isActive: true,
    url: "/",
    icon: CircleGauge,
  },
  {
    title: "Data buku",
    url: "/library",
    icon: Book,
    isActive: true,
  },
  {
    title: "Rak",
    url: "/library/rack",
    icon: ShelvingUnit,
    isActive: true,
  },
  {
    title: "Peminjaman",
    url: "/library/borrow",
    icon: HandHelping,
    isActive: true,
  },
  {
    title: "Member",
    url: "/library/member",
    icon: Users,
    isActive: true,
  },
];
export const Nav2: NavigationMenu[] = [
  {
    title: "Profile",
    isActive: true,
    url: "/profile",
    icon: User,
  },
  {
    title: "Akun",
    isActive: true,
    url: "/account",
    icon: UserPen,
  },
];

export const NavMain: NavigationMenu[] = [
  {
    title: "Dashboard",
    isActive: true,
    url: "/",
    icon: CircleGauge,
  },
  {
    title: "Profile",
    isActive: true,
    url: "/profile",
    icon: User,
  },
  {
    title: "Akun",
    isActive: true,
    url: "/account",
    icon: UserPen,
  },
];

export const NavLibrary: Navigation = {
  label: "Perpustakaan",
  navigations: [
    {
      title: "Data buku",
      url: "/library",
      icon: Book,
      isActive: true,
    },
    {
      title: "Member",
      url: "/library/member",
      icon: Users,
      isActive: true,
    },
    {
      title: "Peminjaman",
      url: "/library/borrow",
      icon: HandHelping,
      isActive: true,
    },
    {
      title: "Rak",
      url: "/library/rack",
      icon: ShelvingUnit,
      isActive: true,
    },
  ],
};
