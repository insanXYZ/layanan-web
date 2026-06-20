import { zodResolver } from "@hookform/resolvers/zod";
import { Book, Camera, Plus } from "lucide-react";
import Image from "next/image";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateBookRequest } from "@/dto/book-dto";
import { RackDto } from "@/dto/rack-dto";
import {
  ContentType,
  HttpMethod,
  useMutationTanstack,
  useQueryTanstack,
} from "@/hooks/use-tanstack";

export default function ButtonCreateBook() {
  const [open, setOpen] = useState<boolean>(false);
  const { data: dataRack, isPending: isPendingRack } = useQueryTanstack(
    ["getRacks"],
    "/racks",
  );
  const [previewImageThumbnail, setPreviewImageThumbnail] = useState<
    string | null
  >(null);

  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getBooks"],
    true,
  );

  const form = useForm<z.infer<typeof CreateBookRequest>>({
    defaultValues: {
      image: undefined,
      rack_id: undefined,
      quantity: 0,
      title: "",
    },
    resolver: zodResolver(CreateBookRequest),
  });

  const onSubmit = (data: z.infer<typeof CreateBookRequest>) => {
    mutate({
      body: data,
      method: HttpMethod.POST,
      url: "/books",
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
    if (isSuccess) {
      setOpen(false);
      setPreviewImageThumbnail(null);
      form.reset();
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={isPendingRack} asChild>
        <Button className="bg-bungur text-white">
          <Plus />
          Tambah Buku
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
          <DialogHeader>
            <DialogTitle>
              <Book /> Tambah Buku
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
                    <FieldLabel htmlFor={name}>
                      <div className="flex w-full justify-center">
                        {previewImageThumbnail ? (
                          <Image
                            src={previewImageThumbnail}
                            alt="preview image"
                            width={0}
                            height={0}
                            className="aspect-cover-book w-32 object-cover"
                          />
                        ) : (
                          <div className="bg-gray-300 aspect-cover-book w-32 object-cover flex justify-center items-center border-dotted rounded-xl">
                            <Camera />
                          </div>
                        )}
                      </div>
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
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Judul</FieldLabel>
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
                name="quantity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Kuantitas</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      autoComplete="off"
                      type="number"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="rack_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Rak</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value ? field.value.toString() : undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="rak" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {(dataRack?.data as RackDto[]).map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id!.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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
