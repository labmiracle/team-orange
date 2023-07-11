import { useEffect } from "react";

export default function Welcome() {
    useEffect(() => {
        const root = document.getElementById("root");
        root?.style.setProperty("--text-primary", "white");
        root?.style.setProperty("--text-secondary", "white");
        root?.style.setProperty("--primary", "black");
        root?.style.setProperty("--secondary", "black");
        root?.style.setProperty("--tertiary", "black");
    }, []);

    return (
        <main>
            <h1>Welcome!&#128512;</h1>
        </main>
    );
}
