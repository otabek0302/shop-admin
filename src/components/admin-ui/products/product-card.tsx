"use client";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCardProps } from "@/interfaces/products";
import { useProductStore } from "@/store/product-store";
import { useModalStore } from "@/store/modal-store";
import { useConfirmStore } from "@/store/confirm-store";

const ProductCard = ({ product }: ProductCardProps) => {
  const { setOpen } = useModalStore();
  const { openConfirm } = useConfirmStore();
  const { setEditData, setDeleteData } = useProductStore();

  const handleClick = (action: "edit" | "delete") => {
    if (action === "edit") {
      setEditData(product);
      setOpen(true);
    }
    if (action === "delete") {
      setDeleteData(product);
      openConfirm();
    }
  };

  return (
    <Card className="rounded-xl overflow-hidden shadow-sm p-4 space-y-4 w-full">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="relative w-32 h-32 border border-border rounded-md overflow-hidden">
            <Image src={product?.image?.url} alt={product?.name} fill className="object-cover object-center" />
          </div>
          <div className="space-y-2 flex flex-col justify-center">
            <h2 className="text-xl font-bold">{product?.name}</h2>
            <p className="text-sm font-normal">{typeof product?.category === "object" ? product?.category?.name : product?.category}</p>
            <p className="text-sm font-normal">₹{product?.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full cursor-pointer" onClick={() => handleClick("edit")}>
            <Pencil className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full cursor-pointer" onClick={() => handleClick("delete")}>
            <Trash className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold">Summary</h3>
        <p className="text-sm font-normal text-muted-foreground space-y-1 space-x-1">
          <span className="font-semibold">Brand:</span>
          <span className="font-normal">{product?.brand}</span>
        </p>
        <p className="text-sm font-normal text-muted-foreground space-y-1 space-x-1">
          <span className="font-semibold">Description:</span>
          <span className="font-normal">{product?.description}</span>
        </p>
      </div>

      <CardContent className="rounded-lg border border-border px-4 py-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Sales</span>
          <span className="flex items-center gap-1 text-orange-500 font-semibold">
            <ArrowUpRight className="h-4 w-4" />
            {product?.sales}
          </span>
        </div>
        <hr />
        <div className="flex items-center justify-between gap-10">
          <span className="w-full text-sm font-medium text-gray-700">Remaining Products</span>
          <Progress value={product?.stock >= 100 ? 100 : product?.stock} className="h-2" />
          <span className="text-sm text-muted-foreground">{product?.stock}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
