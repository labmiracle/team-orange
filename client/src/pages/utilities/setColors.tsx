import { ColorsType } from "../../types/index.d";
/**
 * Set the text color depending on the brightness of the background color
 * @param light lightness of color
 * @returns
 */
function setTextColor(light: number) {
    if (light >= 50) {
        return "black";
    } else {
        return "white";
    }
}

/**
 * Set global primary, secondary colors and use {@link setTextColor} to set the text
 * @param colors {@link Types.ColorsType}
 */
export function setColors(colors: ColorsType) {
    const root = document.getElementById("root");
    if (root) {
        root.style.setProperty("--text-primary", setTextColor(colors.primary.light));
        root.style.setProperty("--text-secondary", setTextColor(colors.secondary.light));
        root.style.setProperty("--primary", `hsl(${colors.primary.hue} ${colors.primary.sat}% ${colors.primary.light}%)`);
        root.style.setProperty("--secondary", `hsl(${colors.secondary.hue} ${colors.secondary.sat}% ${colors.secondary.light}%)`);
        root.style.setProperty("--tertiary", `hsl(${colors.primary.hue} ${colors.primary.sat - 7}% ${colors.primary.light + 10}%)`);
    }
}