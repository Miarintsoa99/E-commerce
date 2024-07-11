const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { error } = require("console");

app.use(express.json());
app.use(cors());

//connexion avec mongoDb
mongoose.connect("mongodb://localhost:27017/commerce");

// api création
app.get("/", (req, res) => {
  res.send("Express app démarre");
});

//stockage image
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// création upload pour les images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// schéma pour les produit
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avilable: {
    type: Boolean,
    default: true,
  },
});

// api créer un produit
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  // pour l'incrémentation de l'id
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  // product data base
  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// api pour effacer un produit
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// api pour avoir tous les produits
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

// schémas pour le userModel
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

// Création de l'enregistrement utilisateur lors de l'inscription
app.post("/signup", async (req, res) => {
  try {
    // Vérification si l'email est déjà utilisé
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res
        .status(400)
        .json({ success: false, error: "Cet email est déjà utilisé" });
    }

    // Initialisation du panier avec 300 produits (exemple)
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    // Création d'un nouvel utilisateur
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });

    // Sauvegarde de l'utilisateur dans la base de données
    await user.save();

    // Génération du token JWT pour l'authentification
    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data,'secret-ecom');

    // Réponse avec succès et token JWT
    res.json({ success: true, token });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ success: false, error: "Erreur lors de l'inscription" });
  }
});

// création user login 
app.post('/login',async (req, res)=> {
   let user = await Users.findOne({email:req.body.email});
   if (user){
     const passCompare = req.body.password === user.password;
     if(passCompare){
       const data = {
          user : {
            id:user.id
          }
       } 
       const token = jwt.sign(data , 'secret-ecom');
       res.json({success : true , token });
     }
     else{
      res.json({success:false, error:"Mauvais mot de passe "});
     }
   } 
   else {
    res.json({success : false , error : "Mauvais email"})
   }
})

// api pour les nouveau collection 
app.get('/newcollections',async(req, res)=> {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New collection fetched");
    res.send(newcollection);
}) 

// api popular pour les women
app.get('/popularinwomen' , async(req,res)=>{
  let products = await Product.find({category: "women"});
  let popular_in_women = products.slice(0,4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);

}) 

// Middleware pour vérifier et extraire l'utilisateur à partir du token JWT
const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
      return res.status(401).send({ errors: "Veuillez vous authentifier pour valider l'achat" });
  }
  try {
      const data = jwt.verify(token, 'secret-ecom');
      req.user = data.user;
      next();
  } catch (error) {
      res.status(401).send({ error: "Authentification échouée, token invalide" });
  }
};


// création api pour ajouter les produits dans le cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
  try {
    console.log("Ajouter", req.body.itemId);
    
    let userData = await Users.findOne({ _id: req.user.id });
    
    if (!userData.cartData[req.body.itemId]) {
      userData.cartData[req.body.itemId] = 0;
    }
    
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    
    res.send("Ajouter");
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    res.status(500).send({ error: "Erreur lors de l'ajout au panier" });
  }
});


// api pour effacer le product sur la carte 
app.post('/removefromcart', fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });
    console.log("Effacer", req.body.itemId);
    
    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
      await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
      res.send("Effacer");
    } else {
      res.status(400).send({ error: "Quantité de l'item est déjà zéro" });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du panier:", error);
    res.status(500).send({ error: "Erreur lors de la suppression du panier" });
  }
});


//api pour le avoir le cart data 
app.post('/getcart', fetchUser,async (req, res) =>{
     console.log("GetCart");
     let userData = await Users.findOne({_id:req.user.id});
     res.json(userData.cartData);
})

app.listen(port, (error) => {
  if (!error) {
    console.log("serveur connecter au port" + port);
  } else {
    console.log("Error" + error);
  }
});
