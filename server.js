const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');


//firebase admin setup
let serviceAccount = require("./webtproject-cc06d-firebase-adminsdk-7jj8s-350dee17a9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    ignoreUndefinedProperties: true 
});

let db = admin.firestore();

//aws config
const aws= require ('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

//aws parameters
const region = "ap-south-1";
const bucketName ="nf-shop";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
    region,
    accessKeyId,
    secretAccessKey
})

//init s3
const s3 = new aws.S3();

//generate image upload link
async function generateURL(){
    let date = new Date();
    let id = parseInt(Math.random() * 10000000000);

    const imageName = `${id}${date.getTime()}.jpg`;

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires:  300, //ms
        ContentType: 'image/jpeg'
    })
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
}

//declare static path
let staticPath = path.join(__dirname, "public");

//initializing express.js
const app = express();

//middlewares
app.use(express.static(staticPath));
app.use(express.json());

//routes
//home route
app.get("/", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"))
})

//signup route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(staticPath, "signup.html"))
})

app.post('/signup', (req, res) => {
    let { name, email, password, number, tac, notification } = req.body

    //form validations
    if (name.length < 3) {
        return res.json({ 'alert': 'name must be 3 letters long' });
    } else if (!email.length) {
        return res.json({ 'alert': 'enter your email' });
    } else if (password.length < 8) {
        return res.json({ 'alert': 'password should be 8 letters long' });
    } else if (!number.length) {
        return res.json({ 'alert': 'enter your phone number' });
    } else if (!Number(number) || number.length < 10) {
        return res.json({ 'alert': 'invalid number, please enter valid one' });
    } else if (!tac) {
        return res.json({ 'alert': 'you must agree to our terms and conditions' });
    }
    //store user in db
    db.collection('users').doc(email).get()
        .then(user => {
            if (user.exists) {
                return res.json({ 'alert': 'email already exists' });
            } else {
                //encrypt the password before storing it
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        db.collection('users').doc(email).set(req.body)
                            .then(data => {
                                res.json({
                                    name: req.body.name,
                                    email: req.body.email,
                                    seller: req.body.seller,
                                })
                            })
                    })
                })
            }
        })
    })

// login route
app.get('/login', (req,res) => {
    res.sendFile(path.join(staticPath, "login.html"));
})

app.post ('/login', (req,res) => {
    let {email, password} = req.body;
    if(!email.length || !password.length){
        return res.json({'alert': 'fill all the inputs'})
    }
    db.collection('users').doc(email).get()
    .then(user =>{
        if (!user.exists) {
            return res.json({'alert': 'log in email does not exist'})
        } else {
            bcrypt.compare(password, user.data().password, (err, result)=>{
                if(result){
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller,
                    })
                } else {
                    return res.json({'alert': 'password is incorrect'});
                }
            })
        }
    })
})
//seller route
app.get('/seller', (req, res) => {
    res.sendFile(path.join(staticPath, "seller.html"));
})

app.post('/seller', (req,res) => {
    let {name,about,address,number,tac,legit,email} = req.body;
    if(!name.length || !address.length || !about.length || number.length <10 || !Number(number)){
        return res.json({'alert': 'some information is invalid'});
    } else if (!tac || !legit) {
        return res.json({'alert': 'you must agree to our terms and conditions'})
    } else {
        //update users seller status here.
        db.collection('sellers').doc(email).set(req.body)
        .then(data => {
            db.collection('users').doc(email).update({
                seller: true
            }).then (data => {
                res.json(true);
            })
        })
    }
})

//add product
app.get('/addProduct', (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
})

//add product
app.get('/addProduct/:id', (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
})


//get the upload link
app.get('/s3url', (req,res) => {
    generateURL().then(url => res.json(url));
})

//add product
app.post('/addProduct', (req,res)=>{
    const{ name,shortDes,des,images,actualPrice,discount,sellingPrice,stock,tags,email,draft, id}= req.body;
    if(!draft){
    if(!name.trim().length){
        return res.json({'alert':'enter product name'});
      } else if (shortDes.trim().length>500 || shortDes.trim().length<10){
        return res.json({'alert':'Description should be in the range between 10 and 500 letters'});
      } else if(!des.trim().length){
        return res.json({'alert':'add desciption about the product'});
      } else if(!images.length){
           return res.json({'alert':'upload at least one product image'});
      } else if(!actualPrice.trim().length || !discount.trim().length || !sellingPrice.trim().length){
           return res.json({'alert':'the pricing must not be empty'});
      } else if(stock.trim()<20){
           return res.json({'alert':'you must have at least 20 product items in stock'});
      } else if(!tags){
        return res.json({'alert':'enter few tags to help ranking your product in search'});
      }
    }

     //add product 
let docName = id ? db.collection('products').doc(name) : db.collection('products').doc(name);
docName.set(req.body)
  .then(() => {
    res.json({'product': name});
  })
  .catch(err => {
    return res.json({'alert': 'some error occured. Try again'})
  });

      
})

//get products
app.post('/get-products', (req,res) =>{
    let{email, id, tag} = req.body;
   
    if(id){
      docRef =  db.collection('products').doc(id)
    } else if (tag) {
      
        docRef = db.collection('products').where('tags', 'array-contains', tag)
      
    } else{
        docRef = db.collection('products').where('email', '==', email)
    }

    docRef.get()
    .then(products =>{
        if(products.empty){
            return res.json('no products')
        }
        let productArr =[];
        if(id){
            return res.json(products.data());
        } else {
            products.forEach(item =>{
                let data =item.data();
                data.id = item.id;
                productArr.push(data);
            })
            res.json(productArr);
        }
    })
})

app.post('/delete-product', (req,res) =>{
    let{id} = req.body;

    db.collection('products').doc(id).delete()
    .then(data =>{
        res.json('success');
    }) .catch(err =>{
        res.json('err');
    })
})

//product page
app.get('/product/:id', (req, res) => {
    res.sendFile(path.join(staticPath, "product.html"));
})

app.get('/cart', (req, res) => {
    res.sendFile(path.join(staticPath, "cart.html"));
})

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(staticPath, "checkout.html"));
})


app.get('/search/:key', (req, res) => {
    res.sendFile(path.join(staticPath, "search.html"));
})

//404 route
app.get('/404', (req, res) => {
    res.sendFile(path.join(staticPath, "404.html"));
})

app.use((req, res) => {
    res.redirect('/404');
})

app.listen(3000, () => {
    console.log('listening on port 3000....')
})