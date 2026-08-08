"use client";

import { useCallback, useSyncExternalStore } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/favorites";
import styles from "./FavoriteButton.module.css";

type FavoriteButtonProps = {
  workId: string;
  title: string;
};

export function FavoriteButton({ workId, title }: FavoriteButtonProps) {
  const getSnapshot = useCallback(() => isFavorite(workId), [workId]);
  const getServerSnapshot = useCallback(() => false, []);
  const favorite = useSyncExternalStore(subscribeFavorites, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      className={styles.button}
      aria-pressed={favorite}
      aria-label={favorite ? `${title}をお気に入りから外す` : `${title}をお気に入りに追加する`}
      onClick={() => toggleFavorite(workId)}
    >
      {favorite ? <FaStar aria-hidden /> : <FaRegStar aria-hidden />}
    </button>
  );
}
