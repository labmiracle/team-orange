export default function ShopIconSVG({
    width = 60,
    height = width,
}: {
    width?: number | string;
    height?: number | string;
}) {
    return (
        <div style={{ width: width, height: height }}>
            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <g data-name="Layer 29" id="Layer_29">
                    <path d="M29,31H19a1,1,0,0,1-1-1.09l2-22A1,1,0,0,1,21,7h6a1,1,0,0,1,1,.91l2,22A1,1,0,0,1,29,31Zm-8.91-2h7.82L26.09,9H21.91Z" />
                    <path d="M19,31H3a1,1,0,0,1-1-1.09l2-22A1,1,0,0,1,5,7H21a1,1,0,0,1,1,1.09l-2,22A1,1,0,0,1,19,31ZM4.09,29h14L19.91,9h-14Z" />
                    <rect height="6" width="2" x="23" y="24" />
                    <path d="M17,13a1,1,0,0,1-1-1V6a3,3,0,0,0-6,0v6a1,1,0,0,1-2,0V6A5,5,0,0,1,18,6v6A1,1,0,0,1,17,13Z" />
                    <path d="M23,9a1,1,0,0,1-1-1V6a3,3,0,0,0-3-3,1,1,0,0,1,0-2,5,5,0,0,1,5,5V8A1,1,0,0,1,23,9Z" />
                </g>
            </svg>
        </div>
    );
}
