import Image, { type ImageProps } from "next/image";
import { cloudinaryThumb } from "@/lib/cloudinary";

type Props = Omit<ImageProps, "src"> & {
  src: string;
  thumbWidth?: number;
};

export function OptimizedImage({ src, alt, thumbWidth = 400, fill, width, height, ...rest }: Props) {
  const isLocal = src.startsWith("/images/") || src.startsWith("/");
  const isCloudinary = src.includes("res.cloudinary.com");
  const resolved = isCloudinary ? cloudinaryThumb(src, thumbWidth) : src;

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        unoptimized={isLocal && !isCloudinary}
        loading={rest.priority ? undefined : "lazy"}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width ?? 400}
      height={height ?? 400}
      unoptimized={isLocal && !isCloudinary}
      loading={rest.priority ? undefined : "lazy"}
      {...rest}
    />
  );
}
