export function Line({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 1 30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.5 30V0" stroke="currentColor" />
    </svg>
  );
}

export function Cart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M3.82443 6.0263L3.64203 4.52963C3.57632 3.89515 3.03543 3.41266 2.38991 3.41266H1.71551C1.29822 3.41266 0.959961 3.07848 0.959961 2.66629C0.959961 2.2541 1.29822 1.91992 1.71551 1.91992H2.38991C3.81047 1.91992 5.0007 2.98164 5.14528 4.37771L5.28294 5.70695H20.6162C20.9332 5.70695 21.1714 5.99285 21.1104 6.30016L19.7708 13.049C19.4465 14.6828 17.9971 15.8613 16.3119 15.8613H8.28333C8.51487 16.8706 9.42793 17.6023 10.493 17.6023H16.8165C16.8537 17.6023 16.8907 17.605 16.8722 17.6083C16.9276 17.6043 16.9832 17.6023 17.0391 17.6023C18.2907 17.6023 19.3053 18.6047 19.3053 19.8411C19.3053 21.0776 18.2907 22.0799 17.0391 22.0799C15.7875 22.0799 14.7729 21.0776 14.7729 19.8411C14.7729 19.5835 14.8171 19.3319 14.9019 19.095H12.1267C12.2114 19.3319 12.2556 19.5835 12.2556 19.8411C12.2556 21.0776 11.241 22.0799 9.98944 22.0799C8.73783 22.0799 7.72324 21.0776 7.72324 19.8411C7.72324 19.2958 7.92191 18.7819 8.27103 18.3814C7.4122 17.7635 6.84565 16.8104 6.7358 15.7467L6.7242 15.6344C5.49457 15.1719 4.58707 14.0477 4.46619 12.6823L4.16169 9.24294C4.15655 9.22166 4.15277 9.19981 4.15045 9.17746L3.82443 6.0263ZM9.98944 20.8361C10.5456 20.8361 10.9965 20.3906 10.9965 19.8411C10.9965 19.2916 10.5456 18.8462 9.98944 18.8462C9.43323 18.8462 8.98234 19.2916 8.98234 19.8411C8.98234 20.3906 9.43323 20.8361 9.98944 20.8361ZM17.0391 20.8361C17.5953 20.8361 18.0462 20.3906 18.0462 19.8411C18.0462 19.2916 17.5953 18.8462 17.0391 18.8462C16.4829 18.8462 16.032 19.2916 16.032 19.8411C16.032 20.3906 16.4829 20.8361 17.0391 20.8361Z"
        fill="currentColor"
        fillRule="evenodd"
        id="path"
      />
    </svg>
  );
}

export function Trash({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.4165 2.08337L9.37484 3.12504H5.20817C4.58317 3.12504 4.1665 3.54171 4.1665 4.16671C4.1665 4.79171 4.58317 5.20837 5.20817 5.20837H7.2915H17.7082H19.7915C20.4165 5.20837 20.8332 4.79171 20.8332 4.16671C20.8332 3.54171 20.4165 3.12504 19.7915 3.12504H15.6248L14.5832 2.08337H10.4165ZM5.20817 7.29171V20.8334C5.20817 21.9792 6.14567 22.9167 7.2915 22.9167H17.7082C18.854 22.9167 19.7915 21.9792 19.7915 20.8334V7.29171H5.20817ZM9.37484 9.37504C9.99984 9.37504 10.4165 9.79171 10.4165 10.4167V19.7917C10.4165 20.4167 9.99984 20.8334 9.37484 20.8334C8.74984 20.8334 8.33317 20.4167 8.33317 19.7917V10.4167C8.33317 9.79171 8.74984 9.37504 9.37484 9.37504ZM15.6248 9.37504C16.2498 9.37504 16.6665 9.79171 16.6665 10.4167V19.7917C16.6665 20.4167 16.2498 20.8334 15.6248 20.8334C14.9998 20.8334 14.5832 20.4167 14.5832 19.7917V10.4167C14.5832 9.79171 14.9998 9.37504 15.6248 9.37504Z"
        fill="currentColor"
      />
    </svg>
  );
}