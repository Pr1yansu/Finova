import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message || message.length < 1) return null;
  return (
    <div className="flex items-center gap-x-2 bg-destructive/15 p-3 rounded-md text-sm text-destructive font-semibold capitalize">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};

export default FormError;
