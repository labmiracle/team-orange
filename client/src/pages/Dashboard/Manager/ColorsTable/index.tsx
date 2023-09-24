import { useLoaderData } from "react-router-dom";
import { StoreType, StoreWithProducts } from "@/types";
import { useState } from "react";
import { hslToHex, hexToHSL } from "@/pages/utilities/formatColors";
import { StoreService } from "@/services/Store.service";
import { setColors } from "@/pages/utilities/setColors";

export default function ColorsTable() {
    const data = useLoaderData() as StoreWithProducts;
    const { primary, secondary } = data.colors;

    const [hexColors, setHexColors] = useState({
        primary: hslToHex(primary.hue, primary.sat, primary.light),
        secondary: hslToHex(secondary.hue, secondary.sat, secondary.light),
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        setHexColors(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newColors = {
            primary: hexToHSL(hexColors.primary),
            secondary: hexToHSL(hexColors.secondary),
        };
        console.log(newColors);
        if (!newColors.primary || !newColors.secondary) throw new Error("invalid colors");
        const { categories, sizes, products, ...store } = data;
        const storeToUpdate = { ...store, colors: newColors } as StoreType;
        const storeService = new StoreService();
        try {
            await storeService.update(storeToUpdate);
        } catch (e) {
            throw Error((e as Error).message);
        }
        setColors(data.colors);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="primary">Primary: </label>
            <input type="color" id="primary" name="primary" value={hexColors.primary} onChange={handleChange} />
            <label htmlFor="secondary">Secondary: </label>
            <input type="color" id="secondary" name="secondary" value={hexColors.secondary} onChange={handleChange} />
            <button type="submit">update!</button>
        </form>
    );
}
