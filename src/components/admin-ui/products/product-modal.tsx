"use client";

import ProductCategory from "./product-category";
import ProductImage from "./product-image";
import { ProductFormData } from "@/interfaces/products";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useProductStore } from "@/store/product-store";
import { useModalStore } from "@/store/modal-store";

const ProductModal = () => {
  const { open, setOpen } = useModalStore();
  const { editData, setEditData, editProduct, createProduct } = useProductStore();
  
  const [product, setProduct] = useState<ProductFormData>({
    name: "",
    description: "",
    brand: "",
    price: 0,
    stock: 0,
    category: "",
    imageBase64: null,
  });

  const [image, setImage] = useState<File | null>(null);

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
        name: "",
        description: "",
        brand: "",
        price: 0,
        stock: 0,
        category: "",
        imageBase64: null,
      });
      setImage(null);
    }
  }, [editData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProduct((prev: ProductFormData) => ({
      ...prev,
      [id]: id === "price" || id === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.category || (!image && !editData?.image)) return;

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
    } else {
      await createProduct(productData);
    }

    setOpen(false);
    setEditData(null);
    setImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setEditData(null);
        setImage(null);
      }
      setOpen(isOpen);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ProductImage image={image} setImage={setImage} existingImage={editData?.image} />
          
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={product.name} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={product.description} onChange={handleChange} required />
          </div>
          
          <ProductCategory category={product.category} setCategory={(id) => setProduct((prev) => ({ ...prev, category: id }))} />

          <div className="grid gap-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" value={product.brand} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" value={product.price} onChange={handleChange} required min={0} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" value={product.stock} onChange={handleChange} required min={0} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => {
              setOpen(false);
              setEditData(null);
              setImage(null);
            }}>Cancel</Button>
            <Button type="submit">{editData ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;