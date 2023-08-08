import Sizes from "./Sizes";
import Types from "./Types";
import { setFilterType } from "../../../types";
import { useState } from "react";
import styles from "./menu.module.css";
import MenuSVG from "../../../assets/MenuSVG";

type Props = {
    isCurrentFilter: React.MutableRefObject<{
        type: string;
        size: string;
    }>;
    setFilter: setFilterType;
};

export default function CategoriesSmallMenu({ isCurrentFilter, setFilter }: Props) {
    const [visible, setVisibility] = useState(false);

    return (
        <div className={styles.menu_container}>
            <div
                onClick={() => setVisibility(last => !last)}
                className={visible ? styles.menu_background : styles.hidden}></div>
            <button className={styles.menu_button} onClick={() => setVisibility(last => !last)}>
                <MenuSVG />
            </button>
            <menu className={visible ? styles.menu : styles.hidden}>
                <div>
                    <h4>Sizes</h4>
                    <Sizes isCurrentFilter={isCurrentFilter.current.size} setFilter={setFilter} viewWindow={"small"} />
                </div>
                <div>
                    <h4>Types</h4>
                    <Types isCurrentFilter={isCurrentFilter.current.type} setFilter={setFilter} viewWindow={"small"} />
                </div>
            </menu>
        </div>
    );
}
