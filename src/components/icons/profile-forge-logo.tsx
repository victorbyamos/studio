import type { SVGProps } from "react";

export function ProfileForgeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="40"
      height="40"
      {...props}
    >
      <defs>
        <linearGradient id="b-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3F51B5" }} />
          <stop offset="100%" style={{ stopColor: "#FFAB40" }} />
        </linearGradient>
      </defs>
      <g fill="url(#b-gradient)">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M152 128a24 24 0 1 1-24-24a24 24 0 0 1 24 24Zm-24-8a8 8 0 1 0 8 8a8 8 0 0 0-8-8Z" />
        <path d="M128 72a56 56 0 0 0-56 56a8 8 0 0 0 16 0a40 40 0 1 1 21.39 36.81a8 8 0 1 0-14.78 6.38A56.08 56.08 0 0 0 184 128a55.51 55.51 0 0 0-1.39-12.79a8 8 0 1 0-15.82 2.76A40 40 0 0 1 168 128a39.48 39.48 0 0 1-1.63 12.39a8 8 0 1 0-15.42 4.79A55.54 55.54 0 0 0 128 72Z" />
      </g>
    </svg>
  );
}
