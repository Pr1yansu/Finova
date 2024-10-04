import React from "react";
import DataGrid from "@/components/summary/data-grid";
import { getSummary } from "@/actions/summary";
import DataCharts from "@/components/summary/data-charts";

interface DashboardParams {
  searchParams: {
    from: string;
    to: string;
    accountId: string;
  };
}

const Dashboard = async ({
  searchParams: { from, to, accountId },
}: DashboardParams) => {
  const { data } = await getSummary({
    from,
    to,
    accountId,
  });

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid data={data} />
      <DataCharts data={data} />
    </div>
  );
};

export default Dashboard;
