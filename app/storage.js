import AWS from 'aws-sdk';

// currently not needed
class Storage {
    constructor() {
        this.__init__();
    }

    // init the s3 
    __init__() {
        // Set the region 
        AWS.config.update({
            "region": 'US-east-1',
            "accessKeyId": 'AKIAVO3HYBS4KVFBEBGH',
            'secretAccessKey': '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' 
        });

        // Create S3 service object
        this.s3 = new AWS.S3({apiVersion: '2006-03-01'});

        // Call S3 to list the buckets
        // s3.listBuckets(function(err, data) {
        // if (err) {
        //     console.log("Error", err);
        // } else {
        //     console.log("Success", data.Buckets);
        // }
        // });
    }

    store_did(did) {
        if (!did) {
            throw new Error("no did found!");
        }
        let params = {
            Body: Buffer.from(JSON.stringify(did)), 
            Bucket: "vsw-repo", 
            Key: "public_did"
        }
        return this.s3.putObject(params).promise();
    }

    async get_did() {
        try {
            let param = {Bucket: 'vsw-repo', Key: 'public_did'};
            const file = await this.s3.getObject(param).promise();

            // console.log("get public did from aws: " + did);
            console.log(file.Body.toString());
            return JSON.parse(file.Body.toString());
        } catch(exception) {
            console.log("did not found");
            return null;
        }
        
    }

}

export default Storage;

// testing
// let sto = new Storage();
// const did = await sto.get_did();
// console.log(did);