/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { ProductForCreation, StoreWithProducts } from "@/types";
import { useRouteLoaderData } from "react-router-dom";

type Props = {
    index: number;
    name: string;
    setProductsToCreate: React.Dispatch<React.SetStateAction<ProductForCreation[]>>;
};

export default function TagInput({ index, name, setProductsToCreate }: Props) {
    const [input, setInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const store = useRouteLoaderData("store") as StoreWithProducts;
    const existingCategories = store[name as keyof StoreWithProducts] as string[];

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        setInput(value);
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            handleAddTag(input.trim());
        }
    }

    function handleAddTag(tag: string) {
        if (tag.trim() !== "" && !tags.includes(tag)) {
            setTags(prevTags => [...prevTags, tag]);
            setInput("");
        }
    }

    function deleteTag(tagIndex: number) {
        const updatedTags = tags.filter((_, i) => i !== tagIndex);
        setTags(updatedTags);
    }

    const filteredCategories = existingCategories.filter(category => {
        const isCategoryAlreadyTag = tags.some(tag => category.toLowerCase() === tag.toLowerCase());
        return input && !isCategoryAlreadyTag && category.toLowerCase().includes(input.toLowerCase());
    });

    useEffect(() => {
        setProductsToCreate(prevState => prevState.map((p, i) => (i === index ? { ...p, [name]: tags } : p)));
    }, [tags]);

    return (
        <div className={styles.container}>
            <div className={styles.input_container}>
                <input value={input} placeholder="Enter a tag" onKeyDown={onKeyDown} onChange={onChange} />
                {filteredCategories.length > 0 && (
                    <div className={styles.category_suggestions}>
                        <ul>
                            {filteredCategories.map((category, categoryIndex) => (
                                <li key={categoryIndex} onClick={() => handleAddTag(category)}>
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className={styles.input_tag_container}>
                {tags.map((tag, tagIndex) => {
                    return (
                        <div className={styles.tag} key={tag}>
                            {tag}
                            <button onClick={() => deleteTag(tagIndex)}>x</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
