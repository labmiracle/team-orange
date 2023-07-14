import { useEffect } from "react";
import { setColors } from "../../utilities/setColors";

export default function Welcome() {
    useEffect(() => {
        const colors = { primary: { hue: 0, sat: 0, light: 255 }, secondary: { hue: 0, sat: 0, light: 0 } };
        setColors(colors);
    }, []);

    return (
        <main>
            <h1>Welcome!&#128512;</h1>
        </main>
    );
}
