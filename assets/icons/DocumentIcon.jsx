// DocumentIcon.jsx
const DocumentIcon = ({ size = 20, color = "#555555", className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.69282 13.5399C3.36636 13.5399 3.05328 13.4102 2.82244 13.1794C2.5916 12.9486 2.46191 12.6355 2.46191 12.309V2.4618C2.46191 2.13534 2.5916 1.82226 2.82244 1.59142C3.05328 1.36058 3.36636 1.2309 3.69282 1.2309H8.61643C8.81125 1.23058 9.00421 1.26881 9.1842 1.34338C9.36419 1.41796 9.52765 1.5274 9.66516 1.66541L11.8734 3.87365C12.0118 4.0112 12.1215 4.17481 12.1963 4.35503C12.2711 4.53524 12.3095 4.72849 12.3091 4.92361V12.309C12.3091 12.6355 12.1795 12.9486 11.9486 13.1794C11.7178 13.4102 11.4047 13.5399 11.0782 13.5399H3.69282Z"
        stroke={color}
        strokeWidth="1.2309"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.61621 1.2309V4.30815C8.61621 4.47138 8.68105 4.62792 8.79647 4.74334C8.91189 4.85876 9.06843 4.9236 9.23166 4.9236H12.3089"
        stroke={color}
        strokeWidth="1.2309"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.15473 5.53906H4.92383"
        stroke={color}
        strokeWidth="1.2309"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.84744 8.00085H4.92383"
        stroke={color}
        strokeWidth="1.2309"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.84744 10.4626H4.92383"
        stroke={color}
        strokeWidth="1.2309"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DocumentIcon;
