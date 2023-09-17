import styles from "./index.module.css";

export function Home() {
    return (
        <main className={styles.container}>
            <section>
                <div className={styles.copy}>
                    <h1 className={styles.title}>¡Epa epa epa!</h1>
                    <h2 className={styles.subtitle}> ¡Bienvenido a Shoppy, la magia de las galerías en línea!</h2>
                    <p className={styles.paragraph}>
                        Explorá tiendas únicas con productos exclusivos para todos los gustos. ¡Agregá al carrito y
                        recogé en la tienda física! ¡Una aventura de compras única en Shoppy! 👜🛍️🎉
                    </p>
                </div>
                <img src="header.webp" alt="" width={900} />
            </section>
        </main>
    );
}
