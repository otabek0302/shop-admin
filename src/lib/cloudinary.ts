import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadImage = async (base64Image: string) => {
    const res = await cloudinary.uploader.upload(base64Image, {
        folder: "products",
        crop: "fill",
    });

    return {
        publicId: res.public_id,
        url: res.secure_url,
    };
};

export const deleteImage = async (publicId: string) => {
    await cloudinary.uploader.destroy(publicId);
};