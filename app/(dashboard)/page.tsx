import React from "react";
import DataGrid from "@/components/summary/data-grid";
import { getSummary } from "@/actions/summary";
import DataCharts from "@/components/summary/data-charts";
import DemoSeederBanner from "@/components/summary/demo-seeder-banner";

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

  const isEmpty = !data || (data.income === 0 && data.expenses === 0);

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DemoSeederBanner isEmpty={isEmpty} />
      <DataGrid data={data} />
      <DataCharts data={data} />
    </div>
  );
};

export default Dashboard;
