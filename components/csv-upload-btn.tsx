import React from "react";
import { useCSVReader } from "react-papaparse";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type UploadBtnProps = {
  onUpload: (results: any) => void;
};

const UploadBtn = ({ onUpload }: UploadBtnProps) => {
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button size={"icon"} variant={"outline"} {...getRootProps()}>
          <Upload className="size-4" />
        </Button>
      )}
    </CSVReader>
  );
};

export default UploadBtn;
