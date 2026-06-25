import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
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
import { CreateUserRequest } from "@/dto/user-dto";
import {
  ContentType,
  HttpMethod,
  useMutationTanstack,
} from "@/hooks/use-tanstack";

export default function ButtonCreateUser() {
  const [open, setOpen] = useState<boolean>(false);
  const [previewImageThumbnail, setPreviewImageThumbnail] = useState<
    string | null
  >(null);
  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getUsers"],
    true,
  );
  const form = useForm<z.infer<typeof CreateUserRequest>>({
    defaultValues: {
      image: undefined,
      email: "",
      name: "",
      password: "",
    },
    resolver: zodResolver(CreateUserRequest),
  });

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      setPreviewImageThumbnail(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: z.infer<typeof CreateUserRequest>) => {
    mutate({
      body: data,
      method: HttpMethod.POST,
      url: "/users",
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
      <DialogTrigger asChild>
        <Button className="bg-bungur text-white">
          <Plus />
          Buat Akun
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
          <DialogHeader>
            <DialogTitle>Buat Akun</DialogTitle>
          </DialogHeader>
          <div className="p-6">
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
                        onChange(
                          e.target.files ? e.target.files[0] : undefined,
                        );
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
