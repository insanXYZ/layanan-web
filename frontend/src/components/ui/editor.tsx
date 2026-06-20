import { UploadImageNewsResponse } from "@/dto/news-dto";
import {
  ContentType,
  HttpMethod,
  useMutationTanstack,
} from "@/hooks/use-tanstack";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
  value: ReactQuill.Value | undefined;
  onChange: (v: string) => void;
  uploadUrl: string;
}

export const Editor = ({ value, onChange, uploadUrl }: EditorProps) => {
  const quillRef = useRef<ReactQuill>(null);
  const { mutate, isSuccess, data } = useMutationTanstack(["uploadImageNews"]);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files![0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      mutate({
        url: uploadUrl,
        method: HttpMethod.POST,
        body: formData,
        contentType: ContentType.FORM,
      });
    };
  };

  useEffect(() => {
    if (isSuccess) {
      const imageUrl = (data.data as UploadImageNewsResponse).image_url;
      const quill = quillRef.current!.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", imageUrl);
      quill.setSelection(range.index + 1);
    }
  }, [isSuccess]);

  const [modules] = useState({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  });

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
  ];

  return (
    <ReactQuill
      ref={quillRef}
      modules={modules}
      formats={formats}
      theme="snow"
      value={value}
      onChange={onChange}
    />
  );
};
