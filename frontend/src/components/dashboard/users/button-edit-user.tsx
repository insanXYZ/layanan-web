import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { UpdateUserRequest, UserDto } from "@/dto/user-dto";
import {
  ContentType,
  HttpMethod,
  useMutationTanstack,
} from "@/hooks/use-tanstack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function ButtonEditUser({ user }: { user: UserDto }) {
  const [open, setOpen] = useState<boolean>(false);
  const [previewImageThumbnail, setPreviewImageThumbnail] = useState<
    string | null
  >(user.image ? user.image : null);
  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getUsers"],
    true,
  );
  const form = useForm<z.infer<typeof UpdateUserRequest>>({
    defaultValues: {
      image: undefined,
      email: user.email,
      name: user.name,
      password: undefined,
    },
    resolver: zodResolver(UpdateUserRequest),
  });

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      setPreviewImageThumbnail(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: z.infer<typeof UpdateUserRequest>) => {
    mutate({
      body: data,
      method: HttpMethod.PUT,
      url: `/users/${user.id}`,
      contentType: ContentType.FORM,
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
            <DialogTitle>Edit Akun</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="image"
              control={form.control}
              render={({
                field: { ref, onBlur, name, onChange },
                fieldState,
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={name} className="flex justify-center">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={
                          previewImageThumbnail
                            ? previewImageThumbnail
                            : undefined
                        }
                      />
                      <AvatarFallback>
                        <Camera />
                      </AvatarFallback>
                    </Avatar>
                  </FieldLabel>
                  <Input
                    type="file"
                    id={name}
                    name={name}
                    onBlur={onBlur}
                    ref={ref}
                    onChange={(e) => {
                      onChange(e.target.files ? e.target.files[0] : undefined);
                      handleChangeImage(e);
                    }}
                    accept="image/*"
                    hidden={true}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Kata sandi</FieldLabel>
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
