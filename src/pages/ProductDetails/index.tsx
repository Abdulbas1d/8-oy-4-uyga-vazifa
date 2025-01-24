import React, { useContext, useEffect, useState } from "react";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../axios";
import { CountCart } from "../../App";
import { Toaster, toast } from "react-hot-toast";

interface Product {
  id: number | string;
  attributes: {
    image: string;
    title: string;
    brand: string;
    price: number;
    description: string;
    colors: string[];
  };
}

interface CartItem {
  cartId: string;
  productId: number | string;
  image: string;
  title: string;
  price: number;
  company: string;
  productColor: string;
  amount: number;
}

function ProductsDetails() {
  const [products, setProducts] = useState<Product | null>(null);
  const [productColor, setProductColor] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const context = useContext(CountCart);

  if (!context) throw new Error("CountCart context not found!");
  const { count, setCount } = context;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    api
      .get(`products/${id}`)
      .then((response) => {
        if (response.status === 200) {
          const productData: Product = response.data.data;
          setProducts(productData);
          if (productData?.attributes?.colors?.length > 0) {
            setProductColor(productData.attributes.colors[0]);
          }
        }
      })
      .catch((error) => {
        console.log("Error fetching product details:", error.response?.data || error.message);
      });
  }, [id]);

  function handleToHomePage() {
    navigate("/");
  }

  function handleToProductsPage() {
    navigate("/products");
  }

  function handleAddCard(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (!products) return;

    const card: CartItem = {
      cartId: `${products.id}-${productColor}`,
      productId: products.id,
      image: products.attributes.image,
      title: products.attributes.title,
      price: products.attributes.price,
      company: products.attributes.brand,
      productColor: productColor,
      amount,
    };

    const margeCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    margeCart.push(card);
    localStorage.setItem("cart", JSON.stringify(margeCart));

    setCount(count + 1); 
    toast.success("Cart muvaffaqiyatli qo'shildi!")
  }

  if (!products) {
    return <p>Loading...</p>;
  }

  return (
    <div className="wrapper">
      <div className="top">
        <button onClick={handleToHomePage}>Home</button>
        <p>{">"}</p>
        <button onClick={handleToProductsPage}>Products</button>
      </div>

      <div className="wrapperData">
        <img src={products.attributes.image} alt="Product" />

        <div className="wrapper-right">
          <h3>{products.attributes.title}</h3>
          <h5>{products.attributes.brand}</h5>
          <p className="price">${products.attributes.price}</p>

          <p className="desc">{products.attributes.description}</p>

          <h5 className="color">Colors</h5>

          <div className="btns">
            {products.attributes.colors.map((color) => (
              <button
                key={color}
                type="button"
                style={{
                  backgroundColor: color,
                  border: productColor === color ? "2px solid black" : "none",
                }}
                onClick={() => setProductColor(color)}
              ></button>
            ))}
          </div>

          <label htmlFor="amount">
            Amount
            <select
              name="amount"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>

          <button onClick={handleAddCard} className="add">
            ADD TO BAG
          </button>
          <Toaster />
        </div>
      </div>
    </div>
  );
}

export default ProductsDetails;
