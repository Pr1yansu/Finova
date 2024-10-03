import React from "react";
import { Button } from "@/components/ui/button";
import { ImportTable } from "../table/import-table";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredFields = ["amount", "date", "payee"];

interface SelectedColumnsState {
  [key: string]: string | null;
}

type ImportCardProps = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

const ImportCard = ({ data, onCancel, onSubmit }: ImportCardProps) => {
  const [selectedColumns, setSelectedColumns] =
    React.useState<SelectedColumnsState>({});

  const headers = data[0];
  const body = data.slice(1);

  const handleTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };
      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }
      if (value === "skip") {
        value = null;
      }
      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      headers: headers.map((header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });
          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });

    const formattedData = arrayOfData.map((row) => {
      return {
        ...row,
        amount: convertAmountToMiliUnits(parseFloat(row.amount)),
        date: row.date
          ? format(parse(row.date, dateFormat, new Date()), outputFormat)
          : null,
      };
    });

    onSubmit(formattedData);
  };

  return (
    <>
      <div className="p-4 rounded-lg text-center text-red-700">
        <h4>Are you sure you want to import this data?</h4>
        <p>You can change the column mapping before importing.</p>
      </div>
      <div className="flex justify-between space-x-4 my-4">
        <Button onClick={onCancel} variant="outline" className="mt-4">
          Cancel
        </Button>
        <Button
          onClick={handleContinue}
          disabled={progress < requiredFields.length}
          className="mt-4"
        >
          Continue ({progress}/{requiredFields.length})
        </Button>
      </div>
      <ImportTable
        headers={headers}
        body={body}
        selectedColumns={selectedColumns}
        onTableHeadSelectChange={handleTableHeadSelectChange}
      />
    </>
  );
};

export default ImportCard;
