import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v4 } from "uuid";

const PathContentImage = "/uploads/content-images";
const PathThumbnailImage = "/uploads/thumbnail";
const PathCoverBookImage = "/uploads/book";
const PathUserImage = "/uploads/user";

async function saveImage(file: File, pathDir: string, filename: string) {
  const uploadDir = path.join(process.cwd(), "public", pathDir);

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());

  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, buffer);

  return path.join(pathDir, filename);
}

export async function saveUserImage(
  image: File,
  filename?: string,
): Promise<string> {
  filename = filename ? filename : getFilename(image);
  return saveImage(image, PathUserImage, filename);
}

export async function saveBookCover(
  image: File,
  filename?: string,
): Promise<string> {
  filename = filename ? filename : getFilename(image);
  return saveImage(image, PathCoverBookImage, filename);
}

export async function saveContentImage(
  image: File,
  filename?: string,
): Promise<string> {
  filename = filename ? filename : getFilename(image);
  return saveImage(image, PathContentImage, filename);
}

export async function saveThumbnailImage(
  image: File,
  filename?: string,
): Promise<string> {
  filename = filename ? filename : getFilename(image);
  return saveImage(image, PathThumbnailImage, filename);
}

export function getFilename(image: File) {
  const ext = image.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${v4()}.${ext}`;

  return fileName;
}

export function getAbsoluteFilenameContentImage(filename: string): string {
  return path.join(PathContentImage, filename);
}

export function getAbsoluteFilenameThumbnail(filename: string): string {
  return path.join(PathThumbnailImage, filename);
}

export function getAbsoluteFilenameCoverBook(filename: string): string {
  return path.join(PathCoverBookImage, filename);
}

export function getAbsoluteFilenameUserImage(filename: string): string {
  return path.join(PathUserImage, filename);
}
