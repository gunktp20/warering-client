import { FC, useEffect, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { loadImage } from "./helper";

interface Props {
  id: string
  source: string;
  width: number;
  height: number;
  zoom: number;
  rotation: number;
  onCrop(image: Blob): void;
  onZoomChange(zoomValue: number): void;
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 1;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = degreesToRadians(rotation);

  return {
    boxWidth:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    boxHeight:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

const ImageCropper: FC<Props> = ({
  id,
  source,
  height,
  width,
  zoom,
  rotation,
  onCrop,
  onZoomChange,
}) => {
  const [loading, setLoading] = useState(true);
  const [crop, setCrop] = useState({ x: 0, y: 0, width, height });
  const containerRef = useRef<HTMLDivElement>(null);

  const desiredWidth = width;
  const desiredHeight = height;

  const handleCrop = (_: Area, croppedAreaPixels: Area) => {
    console.log("croppedAreaPixels", croppedAreaPixels);
    try {
      if (!croppedAreaPixels) return;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const image = new Image();
      image.crossOrigin = "anonymous";

      image.onload = () => {
        const { boxWidth, boxHeight } = rotateSize(
          image.width,
          image.height,
          rotation
        );

        const rotRad = degreesToRadians(rotation);
        canvas.width = boxWidth;
        canvas.height = boxHeight;

        ctx.translate(boxWidth / 2, boxHeight / 2);
        ctx.rotate(rotRad);
        ctx.translate(-image.width / 2, -image.height / 2);

        ctx.drawImage(image, 0, 0);

        const croppedCanvas = document.createElement("canvas");
        const croppedCtx = croppedCanvas.getContext("2d");

        if (!croppedCtx) return;

        const { x, y, width, height } = croppedAreaPixels;

        croppedCanvas.width = desiredWidth;
        croppedCanvas.height = desiredHeight;
        croppedCtx.drawImage(
          canvas,
          x,
          y,
          width,
          height,
          0,
          0,
          desiredWidth,
          desiredHeight
        );

        croppedCanvas.toBlob((blob) => {
          if (blob) onCrop(blob);
        }, "image/png");
      };

      image.src = source;
    } catch (error) {
      console.log(error);
    }
  };

  const calculateSize = async () => {
    setLoading(true);
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    await loadImage(
      source,
      containerRect.width * (1 / 1),
      containerRect.height * (1 / 1)
    );
    setLoading(false);
  };

  useEffect(() => {
    calculateSize();
  }, [source, containerRef]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      id={id}
      ref={containerRef}
    >
      {loading ? (
        <div className="w-[100%] flex justify-center  h-[165px] items-center">
          <div className="loader w-[50px] h-[50px] border-blue-200 border-b-transparent"></div>
        </div>
      ) : (
        <div
          className="relative bg-none"
          style={{ width: "100%", height: "500px" }}
        >
          <Cropper
            image={source}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            showGrid={true}
            cropShape="round"
            onCropChange={(props) => setCrop({ ...props, width, height })}
            onCropComplete={handleCrop}
            onZoomChange={onZoomChange}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
