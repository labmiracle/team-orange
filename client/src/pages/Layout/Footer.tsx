import styles from "./footer.module.css";
import adidas from "../../assets/logos/adidas.webp";
import boss from "../../assets/logos/boss.webp";
import casio from "../../assets/logos/casio.webp";
import chanel from "../../assets/logos/chanel.webp";
import cheeky from "../../assets/logos/cheeky.webp";
import forever21 from "../../assets/logos/forever21.webp";
import gucci from "../../assets/logos/gucci.webp";
import lacoste from "../../assets/logos/lacoste.webp";
import levis from "../../assets/logos/levis.webp";
import oshkosh from "../../assets/logos/oshkosh.webp";
import polo from "../../assets/logos/polo.webp";
import rolex from "../../assets/logos/rolex.webp";
import swarovski from "../../assets/logos/swarovski.webp";
import zara from "../../assets/logos/zara.webp";

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
                    const logoNameWebP = parts[parts.length - 1];
                    const logoName = logoNameWebP.split(".")[0];
                    return <img className={styles.img} src={brand} key={i} alt={`logo ${logoName}`} />;
                })}
            </div>
        </footer>
    );
}
