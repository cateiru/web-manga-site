import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type CommonProps = {
  variant?: "secondary";
  children: ReactNode;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

type NativeButtonProps = CommonProps & {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button({ variant = "secondary", className, children, ...rest }: ButtonProps) {
  const classNames = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest;
    return (
      <Link href={href} className={classNames} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classNames} {...rest}>
      {children}
    </button>
  );
}
