import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Button } from "../Button";

export default function ScrollToTop() {
    const [visibility, setVisibility] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 1200) {
                setVisibility(true);
            } else {
                setVisibility(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const goTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div>
            <Button
                variant={`${"solid"}`}
                className={`${visibility ? styles.scroll_to_top : styles.hide_btn}`}
                onClick={goTop}>
                &#9650;
            </Button>
        </div>
    );
}
