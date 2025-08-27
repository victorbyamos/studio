import type { SVGProps } from "react";

export function ProfileForgeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width="40"
      height="40"
      {...props}
    >
      <defs>
        <radialGradient
          id="b-gradient"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#800080", stopOpacity: 1 }}
          />
        </radialGradient>
      </defs>
      <path
        d="M60.8 23.2h-18.4v81.6h18.4c13.6 0 24.8-11.2 24.8-24.8v-32c0-13.6-11.2-24.8-24.8-24.8zm-8.8 72v-62.4h8.8c8.8 0 16 7.2 16 16v30.4c0 8.8-7.2 16-16 16h-8.8z"
        fill="url(#b-gradient)"
      />
      <path
        d="M26.4 23.2h-4.8v4.8h4.8v-4.8zm4.8 4.8h-4.8v4.8h4.8v-4.8zm-4.8 4.8h-4.8v4.8h4.8v-4.8zm4.8 4.8h-4.8v4.8h4.8v-4.8zm-9.6-14.4h-4.8v4.8h4.8v-4.8zm4.8 4.8h-4.8v4.8h4.8v-4.8z"
        fill="black"
      />
    </svg>
  );
}