import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import styles from "./index.module.css";

type Props = {
    submitAction: (event: React.FormEvent) => void;
    backAction: () => void;
};

export function PaymentForm({ submitAction, backAction }: Props) {
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
            <Button type="submit">Confirmar pago</Button>
            <Button type="button" variant="ghost" className={styles.backButton} onClick={backAction}>
                Volver
            </Button>
        </form>
    );
}
