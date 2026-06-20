import {
  Book,
  CheckLine,
  Clock,
  HandHelping,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardProps {
  countMember: number;
  countBook: number;
  countBorrow: number;
  totalReturned: number;
  totalLated: number;
  totalBorrowed: number;
}

export function SectionCards({
  countMember,
  countBook,
  countBorrow,
  totalBorrowed,
  totalLated,
  totalReturned,
}: SectionCardProps) {
  return (
    <div className="grid grid-cols-3 gap-4  *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card bg-[#D2D8E8]">
        <CardHeader className="flex gap-5 items-center">
          <Book width={70} height={70} className="text-bungur" />
          <div className="flex flex-col gap-5">
            <CardDescription>Total Buku</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {countBook}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card bg-[#D2D8E8]">
        <CardHeader className="flex gap-5 items-center">
          <Users width={70} height={70} className="text-bungur" />
          <div className="flex flex-col gap-5">
            <CardDescription>Total Member</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {countMember}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card bg-[#D2D8E8]">
        <CardHeader className="flex gap-5 items-center">
          <HandHelping width={70} height={70} className="text-bungur" />
          <div className="flex flex-col gap-5">
            <CardDescription>Total Peminjaman</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {countBorrow}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card bg-[#B9E7CE]">
        <CardHeader className="flex gap-5 items-center">
          <CheckLine width={70} height={70} className="text-green-500" />
          <div className="flex flex-col gap-5">
            <CardDescription>Dikembalikan</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalReturned}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card bg-[#FCE2B6]">
        <CardHeader className="flex gap-5 items-center">
          <Clock width={70} height={70} className="text-orange-500" />
          <div className="flex flex-col gap-5">
            <CardDescription>Dipinjam</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalBorrowed}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card bg-[#FFB3B3]">
        <CardHeader className="flex gap-5 items-center">
          <TriangleAlert width={70} height={70} className="text-red-500" />
          <div className="flex flex-col gap-5">
            <CardDescription>Terlambat</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalLated}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
