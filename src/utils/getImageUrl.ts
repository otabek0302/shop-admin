export function getImageUrl(image: unknown): string {
    if (typeof image === "object" && image !== null && "url" in image) {
        return (image as { url: string }).url;
    }
    return typeof image === "string" ? image : "/placeholder.jpg";
}