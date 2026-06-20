"use client";

import ButtonCreateRack from "@/components/dashboard/rack/button-create-rack";
import RackCardGrid from "@/components/dashboard/rack/card-grid";
import { DataGrid } from "@/components/ui/data-grid";
import { GetRackResponse } from "@/dto/rack-dto";
import { useQueryTanstack } from "@/hooks/use-tanstack";

export default function Page() {
  const { data: dataRacks, isPending: isPendingRacks } = useQueryTanstack(
    ["getRacks"],
    "/racks",
  );

  return (
    <DataGrid
      isPending={isPendingRacks}
      topbar={<ButtonCreateRack />}
      search={{
        isSearch: true,
        column: "name",
        placeholder: "cari rak",
      }}
      renderItem={(i) => <RackCardGrid key={i.id} data={i} />}
      data={dataRacks?.data ? (dataRacks?.data as GetRackResponse[]) : []}
    />
  );
}
