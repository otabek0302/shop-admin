'use client';

import ProductCategory from './product-category';
import ProductImage from './product-image';
import { ProductFormData } from '@/interfaces/products';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useProductStore } from '@/store/product-store';
import { useModalStore } from '@/store/modal-store';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ProductModal = () => {
  const { t } = useTranslation();

  const { open, setOpen } = useModalStore();
  const { editData, setEditData, editProduct, createProduct, loading } = useProductStore();

  const [product, setProduct] = useState<ProductFormData>({
    name: '',
    description: '',
    brand: '',
    price: 0,
    stock: 0,
    category: '',
    imageBase64: null,
  });

  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editData) {
      setProduct({
        name: editData.name,
        description: editData.description,
        brand: editData.brand,
        price: editData.price,
        stock: editData.stock,
        category: editData.category,
        imageBase64: null,
      });
    } else {
      setProduct({
        name: '',
        description: '',
        brand: '',
        price: 0,
        stock: 0,
        category: '',
        imageBase64: null,
      });
      setImage(null);
    }
    setError(null);
  }, [editData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProduct((prev: ProductFormData) => ({
      ...prev,
      [id]: id === 'price' || id === 'stock' ? Number(value) : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!product.name.trim()) {
      setError(t('components.admin-ui.product.product-modal.error.name-required'));
      return;
    }
    if (!product.description.trim()) {
      setError(t('components.admin-ui.product.product-modal.error.description-required'));
      return;
    }
    if (!product.brand.trim()) {
      setError(t('components.admin-ui.product.product-modal.error.brand-required'));
      return;
    }
    if (!product.category) {
      setError(t('components.admin-ui.product.product-modal.error.category-required'));
      return;
    }
    if (product.price <= 0) {
      setError(t('components.admin-ui.product.product-modal.error.price-invalid'));
      return;
    }
    if (product.stock < 0) {
      setError(t('components.admin-ui.product.product-modal.error.stock-invalid'));
      return;
    }
    if (!image && !editData?.image) {
      setError(t('components.admin-ui.product.product-modal.error.image-required'));
      return;
    }

    try {
      const base64 = image
        ? await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(image);
          })
        : null;

      const productData: ProductFormData = {
        ...product,
        imageBase64: base64,
        category: typeof product.category === 'string' ? product.category : product.category.id,
      };

      if (editData) {
        await editProduct(editData.id, productData);
        toast.success(t('components.admin-ui.product.product-modal.success.update'));
      } else {
        await createProduct(productData);
        toast.success(t('components.admin-ui.product.product-modal.success.create'));
      }

      setOpen(false);
      setEditData(null);
      setImage(null);
    } catch (error) {
      console.error('[PRODUCT_SUBMIT_ERROR]', error);
      setError(error instanceof Error ? error.message : t('components.admin-ui.product.product-modal.error.submit-failed'));
      toast.error(t('components.admin-ui.product.product-modal.error.submit-failed'));
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditData(null);
      setImage(null);
      setError(null);
    }
    setOpen(isOpen);
  };

  const handleCancel = () => {
    setOpen(false);
    setEditData(null);
    setImage(null);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="no-scrollbar w-[95vw] h-[95vh] max-w-md overflow-y-auto sm:max-w-xl sm:rounded-lg">
        <DialogTitle>{editData ? t('components.admin-ui.product.product-modal.edit-title') : t('components.admin-ui.product.product-modal.add-title')}</DialogTitle>
        <DialogDescription>{editData ? t('components.admin-ui.product.product-modal.edit-description') : t('components.admin-ui.product.product-modal.add-description')}</DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ProductImage image={image} setImage={setImage} existingImage={editData?.image} />

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

          <div className="grid gap-2">
            <Label htmlFor="name">{t('components.admin-ui.product.product-modal.label.name')}</Label>
            <Input id="name" value={product.name} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">{t('components.admin-ui.product.product-modal.label.description')}</Label>
            <Textarea id="description" value={product.description} onChange={handleChange} required />
          </div>

          <ProductCategory category={product.category} setCategory={(id) => setProduct((prev) => ({ ...prev, category: id }))} />

          <div className="grid gap-2">
            <Label htmlFor="brand">{t('components.admin-ui.product.product-modal.label.brand')}</Label>
            <Input id="brand" value={product.brand} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">{t('components.admin-ui.product.product-modal.label.price')}</Label>
            <Input id="price" type="text" value={product.price} onChange={handleChange} required min={0} step="0.01" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock">{t('components.admin-ui.product.product-modal.label.stock')}</Label>
            <Input id="stock" type="text" value={product.stock} onChange={handleChange} required min={0} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" className="cursor-pointer" disabled={loading} onClick={handleCancel}>
              {t('components.admin-ui.product.product-modal.cancel')}
            </Button>
            <Button disabled={loading} className={`relative cursor-pointer dark:bg-gray-800 dark:text-white ${loading ? 'opacity-70' : ''}`} type="submit">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
              <span className={loading ? 'opacity-0' : ''}>{editData ? t('components.admin-ui.product.product-modal.update') : t('components.admin-ui.product.product-modal.create')}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
