const expressSession = require('express-session');
const mongodbStore = require('connect-mongodb-session');

function createSessionStore(session){
    const mongoDBStore = mongodbStore(expressSession);

    const store = new mongoDBStore({
        uri: 'mongodb://localhost:27017',
        databaseName: 'online-shop',
        collection: 'sessions'
    });
    return store;
}

function createSessionConfig(){
    return{
        secret: 'super-secret',
        resave: true,
        saveUnitialized: true,
        store: createSessionStore(),
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000
        }
    };
}

module.exports = createSessionConfig;