const db = require('../data/database');

class Product{
    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = productData.price;
        this.description = productData.description;
        this.image = productData.image; // the name of the image file
        this.imagePath = `product-data/images/${productData.image}`;
        this.imageURL = `/products/assets/images/${productData.image}`;
        
        if(productData._id){
            this.id = productData._id.toString();
        }
        
    }

    static async findAll(){
        const prouct = await db.getDB().collection('products').find().toArray();
        return products.map(function(productDocument){
            return new Product(productDocument);
        });
    }

    async save(){
        const productData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image
        };
        await db.getDB().collection('products').insertOne(productData);   
    }
}

module.exports = Product;