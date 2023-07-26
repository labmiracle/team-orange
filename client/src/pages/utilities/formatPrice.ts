export function formatPrice(price: number) {
    const formattedPrice = new Intl.NumberFormat("es-AR", { currency: "ARS", style: "currency" }).format(price);

    return formattedPrice;
}
