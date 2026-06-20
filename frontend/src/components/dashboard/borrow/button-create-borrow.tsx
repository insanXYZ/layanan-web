import { zodResolver } from "@hookform/resolvers/zod";
import { BookPlus, Plus, Trash, UserRoundPlus } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Counter } from "@/components/ui/counter";
import { DatePicker } from "@/components/ui/date-picker";
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
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetBookResponse } from "@/dto/book-dto";
import { CreateBorrowRequest } from "@/dto/borrow-dto";
import { MemberBorrowDto } from "@/dto/member-borrow-dto";
import {
  HttpMethod,
  useMutationTanstack,
  useQueryTanstack,
} from "@/hooks/use-tanstack";
import ButtonCreateMember from "../member/button-create-member";

export default function ButtonCreateBorrows() {
  const [open, setOpen] = useState<boolean>(false);
  const { data: dataBooks, isPending: isPendingBooks } = useQueryTanstack(
    ["getBooks"],
    "/books",
  );
  const { data: dataMembers, isPending: isPendingMember } = useQueryTanstack(
    ["getMemberBorrows"],
    "/members",
  );
  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getBorrows"],
    true,
  );

  const form = useForm<z.input<typeof CreateBorrowRequest>>({
    defaultValues: {
      member_borrow_id: undefined,
      due_date: undefined,
      borrow_details: [
        {
          book_id: undefined,
          quantity: 0,
        },
      ],
    },
    resolver: zodResolver(CreateBorrowRequest),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "borrow_details",
  });

  const onSubmit = (data: z.input<typeof CreateBorrowRequest>) => {
    const now = DateTime.now();

    const dueDate = DateTime.fromJSDate(data.due_date as Date)
      .set({
        hour: now.hour,
        minute: now.minute,
        second: now.second,
        millisecond: now.millisecond,
      })
      .toISO();

    mutate({
      body: {
        ...data,
        due_date: dueDate,
      },
      method: HttpMethod.POST,
      url: "/borrows",
    });
  };

  const handleAppendBook = () => {
    append({
      quantity: 0,
      book_id: null as unknown as number,
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
      <DialogTrigger disabled={isPendingBooks || isPendingMember} asChild>
        <Button className="bg-bungur text-white">
          <Plus />
          Tambah Pinjaman
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md z-50" showCloseButton={false}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
          <DialogHeader>
            <DialogTitle>Tambah Pinjaman</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            <FieldGroup>
              <Controller
                name="member_borrow_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nama Peminjam</FieldLabel>
                    <div className="flex w-full items-center gap-2">
                      <Combobox
                        items={
                          dataMembers?.data
                            ? (dataMembers.data as MemberBorrowDto[])
                            : []
                        }
                        itemToStringValue={(member) =>
                          (member as MemberBorrowDto).name
                        }
                      >
                        <ComboboxInput
                          placeholder="Pilih nama member"
                          className="bg-white flex-1"
                        />
                        <ComboboxContent className="pointer-events-auto">
                          <ComboboxEmpty>
                            Tidak ada member terdaftar.
                          </ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem
                                key={item.id}
                                value={item.name}
                                onClick={() => {
                                  field.onChange(Number(item.id));
                                }}
                              >
                                {item.name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <ButtonCreateMember label={<UserRoundPlus />} />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <FieldLabel>Tanggal Dipinjam</FieldLabel>
                <DatePicker
                  onChange={undefined}
                  defaultDate={DateTime.now().toJSDate()}
                />
              </Field>

              <Controller
                name="due_date"
                control={form.control}
                render={({ field: { onChange, name }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>Jatuh tempo</FieldLabel>
                    <DatePicker onChange={onChange} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buku</TableHead>
                      <TableHead className="w-25">Jumlah</TableHead>
                      <TableHead className="w-17.5">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((fieldItem, index) => {
                      const choosedBookId = form.watch(
                        `borrow_details.${index}.book_id`,
                      );

                      const choosedBook = dataBooks?.data
                        ? (dataBooks?.data as GetBookResponse[]).filter(
                            (v) => v.id == choosedBookId,
                          )
                        : undefined;

                      return (
                        <TableRow key={fieldItem.id}>
                          <TableCell>
                            <Controller
                              name={`borrow_details.${index}.book_id`}
                              control={form.control}
                              render={({ field }) => (
                                <div>
                                  <Combobox
                                    items={
                                      dataBooks?.data
                                        ? (dataBooks.data as GetBookResponse[])
                                        : []
                                    }
                                    itemToStringValue={(book) =>
                                      (book as GetBookResponse).title
                                    }
                                  >
                                    <ComboboxInput
                                      placeholder="Pilih buku"
                                      className={"bg-white"}
                                    />
                                    <ComboboxContent className="pointer-events-auto bg-white">
                                      <ComboboxEmpty>
                                        Tidak ada buku.
                                      </ComboboxEmpty>
                                      <ComboboxList>
                                        {(item) => (
                                          <ComboboxItem
                                            key={item.id}
                                            disabled={
                                              item.available_quantity == 0
                                            }
                                            value={item.title}
                                            onClick={() => {
                                              form.setValue(
                                                `borrow_details.${index}.quantity`,
                                                0,
                                              );
                                              field.onChange(Number(item.id));
                                            }}
                                          >
                                            {item.title}
                                          </ComboboxItem>
                                        )}
                                      </ComboboxList>
                                    </ComboboxContent>
                                  </Combobox>
                                </div>
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <Controller
                              name={`borrow_details.${index}.quantity`}
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <div>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={
                                      choosedBook?.length
                                        ? choosedBook[0].available_quantity
                                        : 0
                                    }
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                  {fieldState.error && (
                                    <p className="text-sm text-red-500">
                                      {fieldState.error.message}
                                    </p>
                                  )}
                                </div>
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <Trash color="red" onClick={() => remove(index)} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div className="w-full flex justify-center">
                          <BookPlus onClick={handleAppendBook} />
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Field>
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
