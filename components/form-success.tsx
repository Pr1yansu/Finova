import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
  message?: string;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-x-2 bg-emerald-500/15 p-3 rounded-md text-sm text-emerald-500 font-semibold capitalize">
      <CheckCircledIcon className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};

export default FormSuccess;
