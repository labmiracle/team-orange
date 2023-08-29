import styles from "./index.module.css";
import CloseIconSVG from "../../../assets/CloseIconSVG"

type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    handleClose: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
};

export const Modal = ({ children, isOpen, handleClose, title }: Props) => {
    if (!isOpen) return null;

    return (
        <div className={styles.container} onPointerDown={() => handleClose(false)}>
            <div className={styles.modal} onPointerDown={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>{title}</h2>
                    <button onClick={() => handleClose(false)}><CloseIconSVG /></button>
                </div>
                <div className={styles.form}>{children}</div>
            </div>
        </div>
    );
};
