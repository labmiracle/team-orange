export default function MenuSVG({ width = 60, height = width }: { width?: number | string; height?: number | string }) {
    return (
        <div style={{ width: width, height: height }}>
            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
        </div>
    );
}
