"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import CardWrapper from "../wrappers/card-wrapper";
import { LuLoader2 } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/actions/verification";
import FormError from "../form-error";
import FormSuccess from "../form-success";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token!");
      return;
    }
    verifyEmail(token)
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSuccess("Email verified successfully!");
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          setError(error.message);
          return;
        }
        setError("An error occurred. Please try again!");
        return;
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your email address"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      {!error && !success && (
        <div className="flex items-center justify-center w-full">
          <LuLoader2 className="text-primary-500 animate-spin h-16 w-16 text-muted-foreground" />
        </div>
      )}
      <FormError message={error} />
      <FormSuccess message={success} />
    </CardWrapper>
  );
};

const WrappedNewVerificationForm = () => {
  return (
    <Suspense>
      <NewVerificationForm />
    </Suspense>
  );
};

export default WrappedNewVerificationForm;
