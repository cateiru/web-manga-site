"use client";

import { useState } from "react";
import { PlaceholderThumbnail } from "./PlaceholderThumbnail";
import styles from "./ThumbnailImage.module.css";

type ThumbnailImageProps = {
  src: string | null;
  alt: string;
};

export function ThumbnailImage({ src, alt }: ThumbnailImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <PlaceholderThumbnail />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- 掲載サイト任意ドメインの画像をnext/image最適化なしで表示するため
    <img
      src={src}
      alt={alt}
      className={styles.image}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
