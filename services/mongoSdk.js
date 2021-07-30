const {MongoClient} = require('mongodb');

module.exports = class MongoDBClient {
    constructor(databaseName, password, afterConnect) {
        this.databaseName = databaseName;
        this.password = password;
        this.afterConnect = afterConnect;
        this.uri = `mongodb+srv://managetollroad:${password}@cluster0.zjou6.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
    }

    connect() {
        const obj=this;
        this.client = new MongoClient(this.uri, {useNewUrlParser: true, useUnifiedTopology: true});
        this.client.connect((err,res) => {
            if(err)
            {
                throw err;
            }
            obj.client=res;
            obj.afterConnect(res)
        });
    }

    createCollection(dbName, collectionName, afterCreation){
        return this.client.db(dbName).createCollection(collectionName,undefined,afterCreation);
    }

    addDataToCollection(dbName,collectionName,data,afterAddedData){
        console.log(`Append to [${dbName}] db at collection [${collectionName}] new document: ${JSON.stringify(data)}`)
        return this.client.db(dbName).collection(collectionName).insertOne(data,undefined,afterAddedData);
    }

    async readAllCollectionWithoutId(dbName, collectionName){


        return new Promise((resolve, reject) => {
            this.client.db(dbName).collection(collectionName)
                .find({},{ projection: { _id: 0}}).toArray((err,result)=>{
                if(err)
                    reject(err);
                else{
                    console.log(result)
                    resolve(result);
                }

            })
        })
    }


}