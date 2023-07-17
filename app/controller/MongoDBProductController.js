const path = require('path');
const fs = require('fs');
const db = require('../../config/mongodb');
const { ObjectId } = require('bson');

const index = async (req, res) => {
    try {
        const rs = await db.collection('products').find().toArray();
        res.send(rs);
    } catch (error) {
        console.error(error);
    }
}

const view = async (req, res) => {
    try {
        const rs = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
        res.send(rs);
    } catch (error) {
        console.error(error);
    }
}

const store = async (req, res) => {
    const { name, price, stock, status } = req.body;
    console.log(name, price, stock, status);
    const image = req.file;
    if (image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        try {
            const rs = await db.collection('products').insertOne({ name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}` });
            res.send(rs);
        } catch (error) {
            console.error(error);
        }
    } else {
        try {
            const rs = await db.collection('products').insertOne({
                name, price, stock, status,
            });
            res.send(rs);

        } catch (error) {
            console.error(error);
        }
    }
}

const update = async (req, res) => {
    const image = req.file;
    let target;
    if (image != undefined) {
        target = path.join(__dirname, '../../uploads', image.originalname);
    }
    const newImage = image == undefined ? null : image.originalname;
    db.collection('products').findOne({ _id: new ObjectId(req.params.id) }).then(result => {
        const oldUrlImage = result.image_url != null ? result.image_url.split('public/') : null;
        const oldImage = oldUrlImage != null ? oldUrlImage[1] : null;
        const { name, price, stock, status } = req.body;
        let image_url;

        if (oldImage != null) {
            if (newImage != null) {
                if (oldImage != newImage) {
                    fs.unlink(`uploads/${oldImage}`, () => { });
                    fs.renameSync(image.path, target);
                    image_url = `http://localhost:3000/public/${image.originalname}`;
                    console.log(image_url);
                    db.collection('products').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { name, price, stock, status, image_url } }).then(result => res.send(db.collection('products').findOne({ _id: new ObjectId(result._id) }))).catch(error => res.send(error));
                }
            } else {
                image_url = `http://localhost:3000/public/${oldImage}`;
                db.collection('products').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { name, price, stock, status, image_url } }).then(result => res.send(db.collection('products').findOne({ _id: new ObjectId(result._id) }))).catch(error => res.send(error));
            }
        } else {
            if (newImage != null) {
                fs.unlink(`uploads/${oldImage}`, () => { });
                fs.renameSync(image.path, target);
                image_url = `http://localhost:3000/public/${image.originalname}`;
                db.collection('products').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { name, price, stock, status, image_url } }).then(result => res.send(db.collection('products').findOne({ _id: new ObjectId(result._id) }))).catch(error => res.send(error));
            } else {
                db.collection('products').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { name, price, stock, status, image_url } }).then(result => res.send(db.collection('products').findOne({ _id: new ObjectId(result._id) }))).catch(error => res.send(error));
            }
        }
    }).catch(error => res.send(error));
}

const destroy = async (req, res) => {
    try {
        const result = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
        const oldUrlImage = result.image_url != null ? result.image_url.split('public/') : null;
        const oldImage = oldUrlImage != null ? oldUrlImage[1] : null;
        if (oldImage !== null) {
            fs.unlink(`uploads/${oldImage}`, () => { });
        }
        const rs = db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
        res.send(rs);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { index, view, store, update, destroy };