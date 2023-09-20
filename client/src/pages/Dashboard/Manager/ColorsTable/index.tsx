import { useLoaderData } from "react-router-dom";
import { StoreType, StoreWithProducts } from "../../../../types";
import { useState } from "react";
import { hslToHex, hexToHSL } from "../../../utilities/formatColors";
import { StoreService } from "../../../../services/Store.service";

export default function ColorsTable() {
    const data = useLoaderData() as StoreWithProducts;

    const [colors, setColors] = useState({
        primary: hslToHex(data.colors.primary.hue, data.colors.primary.sat, data.colors.primary.light),
        secondary: hslToHex(data.colors.secondary.hue, data.colors.secondary.sat, data.colors.secondary.light),
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        setColors(prev => ({ ...prev, [name]: value }));
        console.log(colors);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newColors = {
            primary: hexToHSL(colors.primary),
            secondary: hexToHSL(colors.secondary),
        };
        console.log(newColors);
        if (!newColors.primary || !newColors.secondary) throw new Error("invalid colors");
        const { categories, sizes, products, ...store } = data;
        const storeToUpdate = { ...store, colors: newColors } as StoreType;
        const storeService = new StoreService();
        await storeService.update(storeToUpdate);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="primary">Primary: </label>
            <input type="color" id="primary" name="primary" value={colors.primary} onChange={handleChange} />
            <label htmlFor="secondary">Secondary: </label>
            <input type="color" id="secondary" name="secondary" value={colors.secondary} onChange={handleChange} />
            <button type="submit">update!</button>
        </form>
    );
}
