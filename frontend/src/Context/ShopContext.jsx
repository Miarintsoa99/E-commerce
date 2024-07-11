import React, { createContext, useEffect, useState } from "react";

// Créer un nouveau contexte avec une valeur par défaut de null
export const ShopContext = createContext(null);

// Fonction pour initialiser le panier avec tous les produits à 0
const getDefaultCart = () => {
  let cart = {};
  // Parcourir tous les produits et initialiser leur quantité à 0
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

// Composant fournisseur de contexte pour le panier
const ShopContextProvider = (props) => {
  // tous les produits
  const [all_product, setAll_Product] = useState([]);

  // Utiliser useState pour gérer l'état du panier, initialisé avec getDefaultCart
  const [cartItems, setCartItems] = useState(getDefaultCart());

  // prendre les données dans le back end
  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((response) => response.json())
      .then((data) => setAll_Product(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des produits:", error)
      );

    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/getcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-type": "application/json",
        },
        body: "",
      })
        .then((response) => response.json())
        .then((data) => setCartItems(data))
        .catch((error) =>
          console.error("Erreur lors de la récupération du panier:", error)
        );
    }
  }, []);

  // Fonction pour ajouter un produit au panier
  // paramétre itemId - L'identifiant unique de l'article à ajouter.
  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  // Fonction pour retirer un produit du panier removefromcart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  // fonction total des cart
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    // Parcourir chaque élément dans cartItems
    for (const item in cartItems) {
      // Vérifier si la quantité de l'article est supérieure à 0
      if (cartItems[item] > 0) {
        // Trouver l'information de l'article dans all_product en utilisant l'ID de l'article
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        // Ajouter le prix de l'article multiplié par sa quantité au total
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    // Retourner le total après avoir parcouru tous les éléments
    return totalAmount;
  };

  // nombre des produits sur le icon cart
  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  // Définir la valeur du contexte pour inclure tous les produits, les articles du panier, et les fonctions pour ajouter/retirer des articles
  const contextValue = {
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartItems,
  };

  // Retourner le fournisseur de contexte avec la valeur définie
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

// Exporter le fournisseur de contexte par défaut
export default ShopContextProvider;

// injectena any amin'ny main.jsx

/*
 * Cet exemple montre comment l'API Context de React peut être utilisée pour
 * partager des données globales sans avoir à passer explicitement des props à chaque niveau de
 * l'arborescence des composants. Cela est particulièrement utile pour les données qui doivent
 * être accessibles par de nombreux composants dans l'application,
 * comme les préférences de thème ou les informations de l'utilisateur.
 */

/*
 * addToCart
 * Objectif : Ajouter un article au panier.
 * Paramètre : itemId - L'identifiant unique de l'article à ajouter.
 * Fonctionnement :
 * Utilise setCartItems pour mettre à jour l'état du panier.
 * La fonction setCartItems prend une fonction de mise à jour en argument, qui reçoit l'état précédent du panier (prev) et retourne un nouvel état.
 * L'opérateur de décomposition (...) est utilisé pour créer une copie de l'objet prev (l'état précédent du panier), puis l'article avec l'ID itemId est ajouté ou mis à jour dans cet objet copié.
 * Si l'article existe déjà dans le panier, sa quantité est augmentée de 1. Si l'article n'existe pas, il est ajouté avec une quantité de 1.
 */
