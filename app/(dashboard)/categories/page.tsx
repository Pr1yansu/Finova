import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";

import ClientTable from "./client/client-table";
import { getFinancialCategories } from "@/actions/financial-categories";
import OpenCategorySheetBtn from "./client/open-category-sheet";
import DemoSeederBanner from "@/components/summary/demo-seeder-banner";

interface Props {
  searchParams: {
    search: string;
  };
}

const Categories = async ({ searchParams }: Props) => {
  const { data, error } = await getFinancialCategories(
    searchParams.search || ""
  );
  const isEmpty = !searchParams.search && (!data || data.length === 0);

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DemoSeederBanner
        isEmpty={isEmpty}
        title="Welcome to your Categories!"
        description="It looks like you don't have any spending categories yet. Get started instantly by seeding your profile with standard categories, accounts, and a rich set of transactions."
      />
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex md:flex-row gap-y-2 md:items-center md:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Categories</CardTitle>
          <OpenCategorySheetBtn>
            <>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Category
            </>
          </OpenCategorySheetBtn>
        </CardHeader>
        <CardContent>
          <ClientTable data={data} error={error} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
