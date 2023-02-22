interface NATokenProps {
  size?: string;
}
export const NAToken = ({ size = "40" }: NATokenProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_45_8268)">
      <path
        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
        fill="#3E38B0"
      />
      <path
        d="M18.78 23.924C18.78 23.26 18.82 22.692 18.9 22.22C18.988 21.748 19.152 21.292 19.392 20.852C19.584 20.484 19.804 20.176 20.052 19.928C20.308 19.672 20.648 19.384 21.072 19.064C21.36 18.848 21.596 18.66 21.78 18.5C21.972 18.34 22.16 18.16 22.344 17.96C22.64 17.624 22.844 17.28 22.956 16.928C23.076 16.568 23.136 16.164 23.136 15.716C23.136 14.98 22.956 14.404 22.596 13.988C22.084 13.356 21.28 13.04 20.184 13.04C19.728 13.04 19.308 13.104 18.924 13.232C18.54 13.352 18.224 13.536 17.976 13.784C17.72 14.008 17.528 14.288 17.4 14.624C17.28 14.952 17.224 15.312 17.232 15.704H15C15.048 14.992 15.216 14.324 15.504 13.7C15.792 13.076 16.184 12.564 16.68 12.164C17.136 11.78 17.664 11.492 18.264 11.3C18.872 11.1 19.496 11 20.136 11C20.992 11 21.78 11.132 22.5 11.396C23.22 11.66 23.816 12.064 24.288 12.608C24.656 13.016 24.932 13.484 25.116 14.012C25.308 14.54 25.404 15.096 25.404 15.68C25.404 16.368 25.264 17.024 24.984 17.648C24.712 18.264 24.328 18.828 23.832 19.34C23.64 19.548 23.424 19.752 23.184 19.952C22.952 20.144 22.816 20.256 22.776 20.288C22.44 20.56 22.164 20.8 21.948 21.008C21.74 21.208 21.572 21.42 21.444 21.644C21.276 21.94 21.168 22.22 21.12 22.484C21.072 22.74 21.048 23.084 21.048 23.516V23.924H18.78ZM19.92 28.796C19.528 28.796 19.196 28.664 18.924 28.4C18.66 28.128 18.528 27.796 18.528 27.404C18.528 27.012 18.66 26.684 18.924 26.42C19.196 26.148 19.528 26.012 19.92 26.012C20.32 26.012 20.652 26.148 20.916 26.42C21.188 26.684 21.324 27.012 21.324 27.404C21.324 27.796 21.188 28.128 20.916 28.4C20.652 28.664 20.32 28.796 19.92 28.796Z"
        fill="#F7F2FE"
      />
    </g>
    <defs>
      <clipPath id="clip0_45_8268">
        <rect width={size} height={size} fill="white" />
      </clipPath>
    </defs>
  </svg>
);
