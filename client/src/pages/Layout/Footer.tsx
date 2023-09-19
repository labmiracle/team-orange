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

const imageDimensions = {
    adidas: { width: 80, height: 54 },
    boss: { width: 80, height: 30 },
    casio: { width: 80, height: 14 },
    chanel: { width: 80, height: 45 },
    cheeky: { width: 80, height: 80 },
    forever21: { width: 80, height: 16 },
    gucci: { width: 80, height: 82 },
    lacoste: { width: 80, height: 80 },
    levis: { width: 80, height: 37 },
    oshkosh: { width: 80, height: 80 },
    polo: { width: 80, height: 48 },
    rolex: { width: 80, height: 80 },
    swarovski: { width: 80, height: 45 },
    zara: { width: 80, height: 33 },
};

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
                {Object.entries(imageDimensions).map(([logoName, dimensions], i) => {
                    const brandImage = imgArr.find(image => image.includes(logoName));
                    return (
                        <img
                            className={styles.img}
                            src={brandImage}
                            key={i}
                            alt={`logo ${logoName}`}
                            width={dimensions.width}
                            height={dimensions.height}
                        />
                    );
                })}
            </div>
        </footer>
    );
}
