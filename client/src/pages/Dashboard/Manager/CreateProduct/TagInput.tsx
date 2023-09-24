/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { ProductForCreation } from "../../../../types";

type Props = {
    index: number;
    name: string;
    setProductsToCreate: React.Dispatch<React.SetStateAction<ProductForCreation[]>>;
};

export default function TagInput({ index, name, setProductsToCreate }: Props) {
    const [input, setInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        setInput(value);
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        console.log("onkeydown");
        const key = e.key;
        const trimmedInput = input.trim();

        if (key === "," && trimmedInput.length && !tags.includes(trimmedInput)) {
            e.preventDefault();
            setTags(prevState => [...prevState, trimmedInput]);
            setInput("");
        }

        if (key === "backspace" && !input.length && tags.length) {
            e.preventDefault();
            const tagsCopy = [...tags];
            tagsCopy.pop();

            setTags(tagsCopy);
            setInput("");
        }
    }

    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        console.log("onblur");
        const trimmedInput = input.trim();
        if (trimmedInput.length && !tags.includes(trimmedInput)) {
            setTags(prevState => [...prevState, trimmedInput]);
            setInput("");
            e.currentTarget.focus();
        }
    }

    function deleteTag(tagIndex: number) {
        console.log("delete", tagIndex);
        setTags(prevState => prevState.filter((_, i) => i !== tagIndex));
    }

    useEffect(() => {
        setProductsToCreate(prevState => prevState.map((p, i) => (i === index ? { ...p, [name]: tags } : p)));
    }, [tags]);

    return (
        <div className={styles.input_tag_container}>
            {tags.map((tag, tagIndex) => (
                <div className={styles.tag} key={tag}>
                    {tag}
                    <button onClick={() => deleteTag(tagIndex)}>x</button>
                </div>
            ))}
            <input value={input} placeholder="Enter a tag" onKeyDown={onKeyDown} onChange={onChange} onBlur={onBlur} />
        </div>
    );
}
