import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescrptionBox from '../Components/DescriptionBox/DescrptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => { 
 // Accès à tous les produits depuis ShopContext
 const { all_product } = useContext(ShopContext); 
 // Récupération de l'ID du produit à partir des paramètres de l'URL
 const { productId } = useParams();
 // Conversion de productId en nombre si nécessaire
 const id = Number(productId);
 // Recherche du produit par ID
 const product = all_product.find(e => e.id === id);

 // Gestion du cas où le produit est indéfini
 if (!product) {
    return <div>Produit non trouvé</div>;
 }

 return (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product}/>
      <DescrptionBox />
      <RelatedProducts />
    </div>
 );
}

export default Product;
