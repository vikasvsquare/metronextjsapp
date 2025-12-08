// TruckIcon.jsx
const TruckIcon = ({ size = 24, color = "#555555", className }) => {
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
        d="M6.66699 5V10"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 5V10"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.66699 10H18.0003"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0003 15H17.5003C17.5003 15 17.917 13.5833 18.167 12.6667C18.2503 12.3333 18.3337 12 18.3337 11.6667C18.3337 11.3333 18.2503 11 18.167 10.6667L17.0003 6.5C16.7503 5.66667 15.917 5 15.0003 5H3.33366C2.89163 5 2.46771 5.17559 2.15515 5.48816C1.84259 5.80072 1.66699 6.22464 1.66699 6.66667V15H4.16699"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83366 16.6667C6.75413 16.6667 7.50033 15.9205 7.50033 15C7.50033 14.0795 6.75413 13.3333 5.83366 13.3333C4.91318 13.3333 4.16699 14.0795 4.16699 15C4.16699 15.9205 4.91318 16.6667 5.83366 16.6667Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 15H11.6667"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3337 16.6667C14.2541 16.6667 15.0003 15.9205 15.0003 15C15.0003 14.0795 14.2541 13.3333 13.3337 13.3333C12.4132 13.3333 11.667 14.0795 11.667 15C11.667 15.9205 12.4132 16.6667 13.3337 16.6667Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TruckIcon;
