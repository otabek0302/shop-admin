"use client";

import Image from "next/image";

import { Upload, X } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ProductImageProps } from "@/interfaces/products";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProductImage = ({ image, setImage, existingImage }: ProductImageProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const triggerBrowse = () => fileInputRef.current?.click();
  const removeImage = () => setImage(null);

  return (
    <div>
      <Label className="font-medium mb-2">Product Image</Label>

      <div className="border-2 border-dashed rounded-md p-6 text-center bg-muted hover:bg-muted/60 transition flex flex-col items-center justify-center gap-3 relative">
        {image ? (
          <>
            <div className="relative w-48 h-48 overflow-hidden rounded-md shadow-md">
              <Image src={URL.createObjectURL(image)} alt="Selected" fill className="rounded-md object-cover" />
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1">
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{image.name}</p>
          </>
        ) : existingImage ? (
          <>
            <div className="relative w-48 h-48 overflow-hidden rounded-md shadow-md">
              <Image src={existingImage.url} alt="Existing" fill className="rounded-md object-cover" />
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1">
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Current image</p>
          </>
        ) : (
          <>
            <Upload className="h-12 w-12 text-blue-800" />
            <p className="text-gray-600">Drop your image here, or browse</p>
            <p className="text-gray-500 text-sm">JPG or PNG, max 5MB</p>
            <Button type="button" variant="outline" onClick={triggerBrowse} className="border-blue-800 text-blue-800">
              Browse Files
            </Button>
          </>
        )}

        <Input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  );
};

export default ProductImage;