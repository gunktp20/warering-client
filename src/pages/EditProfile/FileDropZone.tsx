import { useDropzone } from "react-dropzone";

interface Props {
  onDrop: (acceptedFiles: File[]) => void;
}

export default function FileDropZone({ onDrop }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps({
        className:
          "w-[100%] border-2 border-gray-300 border-dashed rounded py-10 px-12 text-center flex items-center justify-center cursor-pointer",
      })}
    >
      <input {...getInputProps()} accept="image/gif, image/jpeg, image/png" />
      {isDragActive ? (
        <p className="">Drop your file here ...</p>
      ) : (
        <p>Drag & drop a file, or click to select files</p>
      )}
    </div>
  );
}
