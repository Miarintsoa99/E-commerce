import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

const ListProduct = () => {
  // Liste des produits
  const [allproducts, setAllProducts] = useState([]);

  // Fonction pour récupérer les informations des produits
  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:4000/allproducts");
      if (!response.ok) {
        throw new Error("La réponse du réseau n'était pas correcte");
      }
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Il y a eu un problème avec l'opération de récupération :", error);
    }
  };

  // Utilisation de useEffect pour appeler fetchInfo lors du montage du composant
  useEffect(() => {
    fetchInfo();
  }, []);

  // Fonction pour supprimer un produit
  const removeProduct = async (id) => {
    try {
      await fetch("http://localhost:4000/removeproduct", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      // Récupérer les informations des produits à nouveau après suppression
      await fetchInfo();
    } catch (error) {
      console.error("Il y a eu un problème avec l'opération de suppression :", error);
    }
  };
  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old price</p>
        <p>New price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <React.Fragment key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img
                src={product.image}
                alt=""
                className="listproduct-product-icon"
              />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img 
                onClick={() => removeProduct(product.id)}
                src={cross_icon}
                alt=""
                className="listproduct-remove-icon"
              />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
