"use client";

import { LoaderCircle } from "lucide-react";
import ChartHistories from "@/components/dashboard/chart-histories";
import { SectionCards } from "@/components/dashboard/section-cards";
import { GetDashboardInformationResponse } from "@/dto/dashboard-dto";
import { useQueryTanstack } from "@/hooks/use-tanstack";

export default function Page() {
  const { data: dataDashboard, isPending: isPendingDashboard } =
    useQueryTanstack(["getDashboard"], "/dashboard");

  const data = dataDashboard?.data
    ? (dataDashboard.data as GetDashboardInformationResponse)
    : undefined;

  return isPendingDashboard ? (
    <div className="w-full flex justify-center items-center">
      <LoaderCircle className="animate-spin" />
    </div>
  ) : (
    <div className="flex flex-col gap-5">
      <SectionCards
        countBorrow={data?.count_borrow!}
        countMember={data?.count_member!}
        countBook={data?.count_book!}
        totalLated={data?.total_lated!}
        totalBorrowed={data?.total_borrowed!}
        totalReturned={data?.total_returned!}
      />
      <ChartHistories borrow_histories={data?.borrow_histories!} />
    </div>
  );
}
