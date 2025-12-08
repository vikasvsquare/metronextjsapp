// ColumnIcon.jsx
const ColumnIcon = ({ size = 24, color = "#555555", className }) => {
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
        d="M10 3.33331V16.6666"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33301 5.83331V4.16665C3.33301 3.94563 3.42081 3.73367 3.57709 3.57739C3.73337 3.42111 3.94533 3.33331 4.16634 3.33331H15.833C16.054 3.33331 16.266 3.42111 16.4223 3.57739C16.5785 3.73367 16.6663 3.94563 16.6663 4.16665V5.83331"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 16.6667H12.5"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ColumnIcon;
