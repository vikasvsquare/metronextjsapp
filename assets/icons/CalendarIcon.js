// CalendarIcon.jsx
const CalendarIcon = ({ size = 24, color = "#555555", className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14.9997 2.5H4.99967C4.0792 2.5 3.33301 3.24619 3.33301 4.16667V14.1667C3.33301 15.0871 4.0792 15.8333 4.99967 15.8333H14.9997C15.9201 15.8333 16.6663 15.0871 16.6663 14.1667V4.16667C16.6663 3.24619 15.9201 2.5 14.9997 2.5Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33301 9.16669H16.6663"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 2.5V9.16667"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66667 15.8333L5 18.3333"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9997 18.3333L13.333 15.8333"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66699 12.5H6.67533"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.333 12.5H13.3413"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CalendarIcon;
