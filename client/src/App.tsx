import { useState } from "react";
import "./App.css";
import { getCamperasPromise } from "./api-functions/api";

type Item = {
  nombre: string;
  marca: string;
  color: string;
};

function App() {
  const [camperas, setCamperas] = useState<Item[]>([]);

  async function getCamperas() {
    const response = await getCamperasPromise();
    setCamperas(response);
  }

  getCamperas();

  if (!camperas) throw new Error("error");
  const camperasComponentes = camperas.map((item: Item, i: number) => {
    return (
      <div key={i}>
        <h1>{item.nombre}</h1>
        <p>Marca: {item.marca}</p>
        <p>Color: {item.color}</p>
      </div>
    );
  });
  return <>{camperasComponentes}</>;
}

export default App;
