import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import styles from "../index.module.css";
import Loader from "../../Loader";

type Props = {
    submitAction: (arg01: React.FormEvent) => void;
    isLoading: boolean;
    backAction: () => void;
};

export function PaymentForm({ submitAction, isLoading, backAction }: Props) {
    return (
        <form onSubmit={submitAction} className={styles.paymentForm}>
            <h3>Informacion personal</h3>
            <div className={styles.personalInfo}>
                <Input className={styles.name} required>
                    Nombre y apellido
                </Input>
                <Input className={styles.documentNumber} type="number" required>
                    Documento
                </Input>
            </div>
            <h3>Medio de pago</h3>
            <div className={styles.cardInfo}>
                <Input required type="number">
                    Numero de la tarjeta
                </Input>
                <div className={styles.thirdRow}>
                    <Input type="month" required className={styles.expireDate}>
                        Vencimiento
                    </Input>
                    <Input type="number" required className={styles.securityCode}>
                        CVV
                    </Input>
                </div>
            </div>
            {isLoading ? (
                <div style={{ height: 35, margin: "auto" }}>
                    <Loader />
                </div>
            ) : (
                <Button type="submit">Confirmar pago</Button>
            )}
            <Button type="button" variant="ghost" className={styles.backButton} onClick={backAction}>
                Volver
            </Button>
        </form>
    );
}
