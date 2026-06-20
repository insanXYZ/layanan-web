import {
  Book,
  CircleGauge,
  HelpingHand,
  LucideIcon,
  MoveLeft,
  ShelvingUnit,
  User,
  UserPen,
  Users,
} from "lucide-react";
import { useRouter } from "next/router";
import { MatchFunction, match } from "path-to-regexp";

interface headerNavigation {
  path: MatchFunction<Partial<Record<string, string | string[]>>>;
  icon: LucideIcon;
  title: string;
  sub?: string;
}

export const HeaderNavigation: headerNavigation[] = [
  {
    path: match("/profile"),
    icon: User,
    title: "Profile",
    sub: "Kelola data profile",
  },
  {
    path: match("/library"),
    icon: Book,
    title: "Buku",
    sub: "Kelola data buku",
  },
  {
    path: match("/account"),
    icon: UserPen,
    title: "Akun",
    sub: "Kelola data akun",
  },
  {
    path: match("/library/rack"),
    icon: ShelvingUnit,
    title: "Rak",
    sub: "Kelola data rak",
  },
  {
    path: match("/library/rack/:id"),
    icon: MoveLeft,
    title: "Detail Rak",
  },
  {
    path: match("/account"),
    icon: UserPen,
    title: "Akun",
    sub: "Kelola data akun",
  },
  {
    path: match("/library/borrow"),
    icon: HelpingHand,
    title: "Peminjaman",
    sub: "Kelola data peminjaman buku",
  },
  {
    path: match("/library/member"),
    icon: Users,
    title: "Member",
    sub: "Kelola data member",
  },
  {
    path: match("/"),
    icon: CircleGauge,
    title: "Dashboard",
    sub: "Dashboard Perpustakaan",
  },
];
