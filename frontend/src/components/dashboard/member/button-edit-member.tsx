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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MemberBorrowDto,
  UpdateMemberBorrowRequest,
} from "@/dto/member-borrow-dto";
import { HttpMethod, useMutationTanstack } from "@/hooks/use-tanstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function ButtonEditMember({
  member,
}: {
  member: MemberBorrowDto;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getMemberBorrows"],
    true,
  );
  const form = useForm<z.infer<typeof UpdateMemberBorrowRequest>>({
    defaultValues: {
      name: member.name,
      phone_number: member.phone_number ? member.phone_number : undefined,
    },
    resolver: zodResolver(UpdateMemberBorrowRequest),
  });

  const onSubmit = (data: z.infer<typeof UpdateMemberBorrowRequest>) => {
    mutate({
      body: data,
      method: HttpMethod.PUT,
      url: `/members/${member.id}`,
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
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Pencil width={20} height={20} />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
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
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="phone_number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nomor Hp</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
