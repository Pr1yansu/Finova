import React from "react";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";

interface ScanTransactionReceiptsButtonProps {
  onScan?: () => void;
}

const ScanTransactionReceiptsButton = ({
  onScan,
}: ScanTransactionReceiptsButtonProps) => {
  return (
    <Button size="icon" variant="outline" onClick={onScan}>
      <Scan />
    </Button>
  );
};

export default ScanTransactionReceiptsButton;
