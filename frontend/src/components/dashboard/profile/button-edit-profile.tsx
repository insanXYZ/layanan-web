import { UserPen } from "lucide-react";
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
import { UpdateMeRequest, UserDto } from "@/dto/user-dto";
import {
  ContentType,
  HttpMethod,
  useMutationTanstack,
  useQueryTanstack,
} from "@/hooks/use-tanstack";

export default function ButtonEditProfile({ user }: { user: UserDto }) {
  const [open, setOpen] = useState<boolean>(false);
  const [previewImageThumbnail, setPreviewImageThumbnail] = useState<
    string | null
  >(user.image ? user.image : null);

  const { mutate, isPending, isSuccess } = useMutationTanstack(["getMe"], true);

  const form = useForm<z.infer<typeof UpdateMeRequest>>({
    defaultValues: {
      image: undefined,
      password: "",
      email: "",
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof UpdateMeRequest>) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("name", data.name);
    if (data.password) formData.append("password", data.password);
    if (data.image) formData.append("image", data.image);

    mutate({
      body: data,
      method: HttpMethod.PUT,
      url: "/me",
      contentType: ContentType.FORM,
    });
  };

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      setPreviewImageThumbnail(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (user) {
      setPreviewImageThumbnail(user.image ? user.image : null);
      form.setValue("name", user.name);
      form.setValue("email", user.email);
    }
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
          <DialogHeader>
            <DialogTitle>
              <UserPen /> Edit Profile
            </DialogTitle>
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
                      <Avatar className="w-52 h-52">
                        <AvatarImage
                          src={
                            previewImageThumbnail
                              ? previewImageThumbnail
                              : undefined
                          }
                        />
                        <AvatarFallback>
                          {user.name.toUpperCase().slice(0, 2)}
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
                    <FieldLabel htmlFor={field.name}>Kata Sandi</FieldLabel>
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
              {/* <Field orientation="horizontal" className="justify-end"> */}
              {/*   <Button variant="outline" type="button"> */}
              {/*     Batal */}
              {/*   </Button> */}
              {/*   <ButtonLoading isPending={isPending}>Perbarui</ButtonLoading> */}
              {/* </Field> */}
            </FieldGroup>
            <DialogFooter className="mt-9">
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <ButtonLoading
                className="bg-bungur text-white"
                type="submit"
                isPending={isPending}
              >
                Simpan
              </ButtonLoading>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
