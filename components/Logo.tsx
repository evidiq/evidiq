import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * EVIDIQ brand logo. The source art is the horizontal lockup
 * (shield mark + "EVIDIQ" wordmark + "know before you trust" tagline)
 * exported to /public/evidiq-logo.png, and the shield-only mark at
 * /public/evidiq-mark.png. Both are transparent PNGs that read on the
 * cream background.
 */

const LOCKUP_RATIO = 729 / 240; // width / height of evidiq-logo.png
const MARK_RATIO = 221 / 256; // width / height of evidiq-mark.png

/** Shield mark only — for compact / square placements. */
export function LogoMark({
  size = 32,
  className,
  priority,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/evidiq-mark.png"
      alt="EVIDIQ"
      width={Math.round(size * MARK_RATIO)}
      height={size}
      priority={priority}
      className={className}
    />
  );
}

/** Full horizontal lockup (mark + wordmark). `height` drives the size. */
export function Logo({
  height = 32,
  className,
  style,
  priority,
}: {
  height?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  return (
    <Image
      src="/evidiq-logo.png"
      alt="EVIDIQ — know before you trust"
      width={Math.round(height * LOCKUP_RATIO)}
      height={height}
      priority={priority}
      className={className}
      style={style}
    />
  );
}
