const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');
const db = require('../data/database');

class User{
    constructor(email,password,fullname,street,postal,city){
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.address = {
            street: street,
            postalCode: postal,
            city: city
        };
    }

    async signup(){
        const hashedPassword = await bcrypt.hash(this.password,12);
        await db.getDB().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            name: this.name,
            address: this.address
        });
    };

    static async findById(userId){
        const uid = new mongodb.ObjectId(userId);

        return db.getDB().collection('users').findOne({_id: uid}, {projection: {password: 0}});
    } 

    compareEmail(){
        return db.getDB().collection('users').findOne({email:this.email})
    }

    comparePassword(hashedPassword){
        return bcrypt.compare(this.password, hashedPassword);
    }

    async existsAlready(){
        const existingUser = await this.compareEmail();
        if(existingUser){
            return true;
        }
        return false;
    }
}

module.exports = User;