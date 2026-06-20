"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Library } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoginRequest } from "@/dto/user-dto";
import { HttpMethod, useMutationTanstack } from "@/hooks/use-tanstack";
import { cn } from "@/lib/utils";
import { ButtonLoading } from "../ui/button-loading";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate, isPending, isSuccess } = useMutationTanstack(["login"], true);

  const defaultValues: z.infer<typeof LoginRequest> = {
    email: "",
    password: "",
  };

  const form = useForm<z.infer<typeof LoginRequest>>({
    defaultValues,
    resolver: zodResolver(LoginRequest),
  });

  const onSubmit = (data: z.infer<typeof LoginRequest>) => {
    mutate({
      body: data,
      method: HttpMethod.POST,
      url: "/auth/login",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      redirect("/");
    }
  }, [isSuccess]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Selamat datang</h1>
                <p className="text-balance text-muted-foreground">
                  Masuk dengan email dan password
                </p>
              </div>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="user@gmail.com"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="*****"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <ButtonLoading isPending={isPending} type="submit">
                  Login
                </ButtonLoading>
              </Field>
            </FieldGroup>
          </form>
          <div className="hidden flex-col gap-4 justify-center items-center bg-bungur md:flex">
            <Library className="text-primary" width={80} height={80} />
            <div className="text-5xl font-bold text-secondary">d'Lib</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
