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
        <radialGradient id="b-gradient-radial" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{ stopColor: "#FFD180" }} />
          <stop offset="40%" style={{ stopColor: "#D32F2F" }} />
          <stop offset="100%" style={{ stopColor: "#4A148C" }} />
        </radialGradient>
      </defs>
      
      <path
        d="M174.4,222.9c-56.9,0-103.1-46.2-103.1-103.1c0-23.7,8-45.4,21.5-63.1h0.1v130.6c0,19.3,15.7,35,35,35H174.4z"
        fill="#000000"
      />
      
      <path
        d="M128.4,56.7c-56.9,0-103.1,46.2-103.1,103.1c0,56.9,46.2,103.1,103.1,103.1s103.1-46.2,103.1-103.1 C231.5,102.9,185.3,56.7,128.4,56.7z M128.4,233.9c-41.1,0-74.5-33.4-74.5-74.5c0-41.1,33.4-74.5,74.5-74.5 c41.1,0,74.5,33.4,74.5,74.5C202.9,200.5,169.5,233.9,128.4,233.9z"
        fill="url(#b-gradient-radial)"
      />
      
      <g fill="#000000">
        <rect x="58.3" y="27.1" width="24" height="24" />
        <rect x="58.3" y="60.1" width="24" height="24" />
        <rect x="86.3" y="47.1" width="24" height="24" />
        <rect x="86.3" y="80.1" width="24" height="24" />
        <rect x="114.3" y="67.1" width="24" height="24" />
        <path d="M114.3,96.1h24v24h-24V96.1z" />
        <path d="M128,128c0-19.9,16.1-36,36-36h0c19.9,0,36,16.1,36,36v0c0,19.9-16.1,36-36,36h0 C144.1,164,128,147.9,128,128L128,128z" fill="#ffffff" />
      </g>
    </svg>
  );
}
