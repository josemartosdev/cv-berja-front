import { useRef, useState } from "react";

export default function DropzoneUpload({
  onFileSelect,
  accept = "image/*",
  label = "Arrastra una foto o haz clic",
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      style={{
        border: `2px dashed ${dragging ? "#4f46e5" : "#ccc"}`,
        borderRadius: 8,
        padding: 32,
        textAlign: "center",
        cursor: "pointer",
        background: dragging ? "#eef2ff" : "#fafafa",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {preview ? (
        <img
          src={preview}
          alt="preview"
          style={{ maxHeight: 200, borderRadius: 6 }}
        />
      ) : (
        <p style={{ color: "#888" }}>{label}</p>
      )}
    </div>
  );
}
