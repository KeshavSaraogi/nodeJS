const db = require('../data/database');
const mongo = require('mongodb');

class Order{
    constructor(cart, userData, status='pending', date, orderId){
        this.productData = cart;
        this.userData = userData;
        this.status = status;
        this.date = new Date(date);

        if(this.date){
            this.formattedDate = this.date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
        this.id = orderId;
    }

    static transformOrderDocument(orderDocument){
        return new Order(
            orderDocument.productData,
            orderDocument.userData,
            orderDocument.status,
            orderDocument.date,
            orderDocument._id
        );
    }

    static transformOrderDocuments(orderDocuments){
        return orderDocuments.map(this.transformOrderDocument);
    }

    static async findAll(){
        const orders = await db.getDB().collection('orders').find().sort({_id: 1}).toArray();
        return this.transformOrderDocuments(orders);
    }

    static async findAllForUsers(userId){
        const uid = new mongodb.ObjectId(userId);
        const orders = await db.getDB().collection('orders').find({'userData._id': uid}).sort({_id: -1}).toArray();
        return this.transformOrderDocuments(orders);
    }

    static async findById(orderId){
        const orders = await db.getDB().collection('orders').findOne({_id: new mongodb.ObjectId(orderId)});
        return this.transformOrderDocuments(orders);
    }

    save(){
        if(this.id){
            const orderId = new mongodb.ObjectId(this.id);
            return db.getDB().collection('orders').updateOne({_id: orderId}, {$set: {status: this.status}});

        } else{
            const orderDocument = {
                userData = this.userData,
                productData = this.productData,
                date: new Date(),
                status: this.status
            };
            return db.getDB().collection('orders').insertOne(orderDocument);
        }
    }
}

module.exports = Order;