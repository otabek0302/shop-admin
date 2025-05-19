'use client';

import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCardProps } from '@/interfaces/products';
import { useProductStore } from '@/store/product-store';
import { useModalStore } from '@/store/modal-store';
import { useConfirmStore } from '@/store/confirm-store';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation();

  const { setOpen } = useModalStore();
  const { openConfirm } = useConfirmStore();
  const { setEditData, setDeleteData } = useProductStore();

  const handleClick = (action: 'edit' | 'delete') => {
    if (action === 'edit') {
      setEditData(product);
      setOpen(true);
    }
    if (action === 'delete') {
      setDeleteData(product);
      openConfirm();
    }
  };

  return (
    <Card className="w-full space-y-4 overflow-hidden rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="border-border relative h-32 w-32 overflow-hidden rounded-md border">
            <Image src={product?.image?.url} alt={product?.name} fill className="object-cover object-center" />
          </div>
          <div className="flex flex-col justify-center space-y-2">
            <h2 className="text-xl font-bold">{product?.name}</h2>
            <p className="text-sm font-normal">{typeof product?.category === 'object' ? product?.category?.name : product?.category}</p>
            <p className="text-sm font-normal">{product?.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="cursor-pointer rounded-full" onClick={() => handleClick('edit')}>
            <Pencil className="text-muted-foreground h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="cursor-pointer rounded-full" onClick={() => handleClick('delete')}>
            <Trash className="text-muted-foreground h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold">{t('components.admin-ui.product.product-card.summary.title')}</h3>
        <p className="text-muted-foreground space-y-1 space-x-1 text-sm font-normal">
          <span className="font-semibold">{t('components.admin-ui.product.product-card.summary.brand')}:</span>
          <span className="font-normal">{product?.brand}</span>
        </p>
        <p className="text-muted-foreground space-y-1 space-x-1 text-sm font-normal">
          <span className="font-semibold">{t('components.admin-ui.product.product-card.summary.description')}:</span>
          <span className="font-normal">{product?.description}</span>
        </p>
      </div>

      <CardContent className="border-border space-y-2 rounded-lg border px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{t('components.admin-ui.product.product-card.sales')}</span>
          <span className="flex items-center gap-1 font-semibold text-orange-500">
            <ArrowUpRight className="h-4 w-4" />
            {product?.sales}
          </span>
        </div>
        <hr />
        <div className="flex items-center justify-between gap-10">
          <span className="w-full text-sm font-medium text-gray-700">{t('components.admin-ui.product.product-card.remaining-products')}</span>
          <Progress value={product?.stock >= 100 ? 100 : product?.stock} className="h-2" />
          <span className="text-muted-foreground text-sm">{product?.stock}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
