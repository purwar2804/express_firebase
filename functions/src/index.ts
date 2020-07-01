import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';

admin.initializeApp(functions.config().firebase);
const app=express();
const main=express();
main.use('/Myapi',app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended:false}));
const db=admin.firestore();
export const webApi=functions.https.onRequest(main);
interface Product 
{
    productName:string,
    productPrice:string,
    productCategory:string,
    id:string

}
//create product
app.post('/product',async(req,res)=>{
try
{
	const product:Product={

	    productName:req.body['productname'],
	    productPrice:req.body['productprice'],
	    productCategory:req.body['productCategory'],
	    id:req.body['id']
	}
	await db.collection("productOnSale").add(product)
}

catch(error){
	res.status(400).send(`error!!`)
}

});
//read product
app.get('/product',async(req, res) => {
    try {
        const product_list = await db.collection("productOnSale").get();
        const products: any[] = [];
        product_list.forEach(
            (doc)=>{
                products.push({
                    id: doc.id,
                    data:doc.data()
            });
            }
        );
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send(error);
    }
});



// Update product
app.put('/product/:productId', async(req, res) => {
    await db.collection("productOnSale").doc(req.params.productId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.productId}))
    .catch((error)=> res.status(500).send(error))

});
//delete product
app.delete('/product/:productId', (req, res) => {
    db.collection("productOnSale").doc(req.params.productId).delete()
    .then(()=>res.status(200).send("product successfully deleted"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})

