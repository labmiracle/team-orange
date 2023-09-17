import { Product } from "../../../../types";

export default function FormProduct({product, setProduct}: {product: Product, setProduct: React.Dispatch<React.SetStateAction<Product>>}) {

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;
    setProduct(prev => ({...prev, [name]: value}))
  }

    return (
        <form>
            <label htmlFor="name" >name:&nbsp</label>
            <input type="text" id="name" name="name" value={product.name} onChange={handleChange}/>
            <label htmlFor="description" >description:&nbsp</label>
            <input type="text" id="description" name="description" value={product.description} onChange={handleChange}/>
            <label htmlFor="price" >price:&nbsp</label>
            <input type="number" min={0} id="price" name="price" value={product.price} onChange={handleChange}/>
            <label htmlFor="discount" >discount:&nbsp</label>
            <input type="number" min={0} max={1} id="discount" name="discountPercentage" value={product.discountPercentage} onChange={handleChange}/>
            <label htmlFor="brand" >brand:&nbsp</label>
            <input type="text" id="brand" name="brand" value={product.brand} onChange={handleChange}/>
            <label htmlFor="reorderPoint" >reorderPoint:&nbsp</label>
            <input type="number" min={0} id="reorderPoint" name="reorderPoint" value={product.reorderPoint} onChange={handleChange}/>
            <label htmlFor="minimum" >minimum:&nbsp</label>
            <input type="number" min={0} id="minimum" name="minimum" value={product.minimum} onChange={handleChange}/>
        </form>
    );
}
