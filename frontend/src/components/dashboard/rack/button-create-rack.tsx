import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CreateRackRequest } from "@/dto/rack-dto";
import { HttpMethod, useMutationTanstack } from "@/hooks/use-tanstack";

export default function ButtonCreateRack() {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getRacks"],
    true,
  );
  const form = useForm<z.infer<typeof CreateRackRequest>>({
    defaultValues: { name: "" },
    resolver: zodResolver(CreateRackRequest),
  });

  const onSubmit = (data: z.infer<typeof CreateRackRequest>) => {
    mutate({
      body: data,
      method: HttpMethod.POST,
      url: "/racks",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      form.reset();
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-bungur text-white">
          <Plus />
          Tambah Rak
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
          <DialogHeader>
            <DialogTitle>Tambah Rak</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="rak"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <ButtonLoading type="submit" isPending={isPending}>
                Simpan
              </ButtonLoading>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
