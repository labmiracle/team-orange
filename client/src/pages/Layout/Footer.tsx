import styles from "./footer.module.css";
import adidas from "../../assets/logos/adidas.png";
import boss from "../../assets/logos/boss.png";
import casio from "../../assets/logos/casio.png";
import chanel from "../../assets/logos/chanel.png";
import cheeky from "../../assets/logos/cheeky.png";
import forever21 from "../../assets/logos/forever21.png";
import gucci from "../../assets/logos/gucci.png";
import lacoste from "../../assets/logos/lacoste.png";
import levis from "../../assets/logos/levis.png";
import oshkosh from "../../assets/logos/oshkosh.png";
import polo from "../../assets/logos/polo.png";
import rolex from "../../assets/logos/rolex.png";
import swarovski from "../../assets/logos/swarovski.png";
import zara from "../../assets/logos/zara.png";

export default function Footer() {
    const imgArr = [
        adidas,
        boss,
        casio,
        chanel,
        cheeky,
        forever21,
        gucci,
        lacoste,
        levis,
        oshkosh,
        polo,
        rolex,
        swarovski,
        zara,
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.logos}>
                {imgArr.map((brand, i) => {
                    const parts = brand.split("/");
                    const logoNamePng = parts[parts.length - 1];
                    const logoName = logoNamePng.split(".")[0];
                    return <img className={styles.img} src={brand} key={i} alt={`logo ${logoName}`} />;
                })}
            </div>
        </footer>
    );
}
