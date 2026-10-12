// A small, simple banana glyph used as the site's logo mark everywhere
// (navbar, footer, favicon-style contexts). Pure inline SVG so it stays
// crisp at any size and inherits the brand palette.
export default function BananaMark({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14 50C13 46 11 36 18 23C23.5 12.5 35 8.5 41.5 10.2C44 10.8 44.9 13.6 42.8 15.2C33.8 22 27.5 30 23.5 39.5C20.8 46 23.5 51.5 29.5 52.6C39.5 54.5 49 46 51 36.2C51.6 33.2 56 33.9 55.5 37C53.7 48.5 42 58.5 29.8 57.4C20 56.5 13 54.5 14 50Z"
        fill="#FFC914"
        stroke="#A3680A"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
      <path d="M42 10.5C42 10.5 46.5 8.3 50 11.5" stroke="#A3680A" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}
