'use client';

import Image from 'next/image';

import { Upload, X } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ProductImageProps } from '@/interfaces/products';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

const ProductImage = ({ image, setImage, existingImage }: ProductImageProps) => {
  const { t } = useTranslation();

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
      <Label className="mb-2 font-medium">{t('components.admin-ui.product.product-modal.image.label')}</Label>

      <div className="bg-muted hover:bg-muted/60 relative flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-6 text-center transition">
        {image ? (
          <>
            <div className="relative h-48 w-48 overflow-hidden rounded-md shadow-md">
              <Image 
                src={URL.createObjectURL(image)} 
                alt="Selected" 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-md object-cover" 
              />
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-white">
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <p className="text-muted-foreground text-sm">{image.name}</p>
          </>
        ) : existingImage ? (
          <>
            <div className="relative h-48 w-48 overflow-hidden rounded-md shadow-md">
              <Image 
                src={existingImage.url} 
                alt="Existing" 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-md object-cover" 
              />
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-white">
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <p className="text-muted-foreground text-sm">{t('components.admin-ui.product.product-modal.current-image')}</p>
          </>
        ) : (
          <>
            <Upload className="h-12 w-12 text-blue-800" />
            <p className="text-gray-600">{t('components.admin-ui.product.product-modal.image.image-placeholder')}</p>
            <p className="text-sm text-gray-500">{t('components.admin-ui.product.product-modal.image.image-max-size')}</p>
            <Button type="button" variant="outline" onClick={triggerBrowse} className="border-blue-800 text-blue-800">
              {t('components.admin-ui.product.product-modal.image.browse-files')}
            </Button>
          </>
        )}

        <Input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  );
};

export default ProductImage;
