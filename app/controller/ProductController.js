const path = require('path');
const fs = require('fs');
const Product = require('../model/Product');
// const escapeStringRegexp = require('escape-string-regexp');

const index = (req, res) => {
    Product.find({})
        .then(result => res.send(result))
        .catch(error => res.send(error));
}

const store = (req, res) => {
    const { name, price, stock, status } = req.body;
    const image = req.file;
    if (image != undefined) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
    }
    let image_url = image == undefined ? null : `http://localhost:3000/public/${image.originalname}`;
    Product.create({ name, price, stock, status, image_url })
        .then(result => res.send(result))
        .catch(error => res.send(error));
}

const show = (req, res) => {
    Product.findById(req.params.id)
        .then(result => res.send(result))
        .catch(error => res.send(error));
}

const update = (req, res) => {
    const image = req.file;
    let target;
    if (image != undefined) {
        target = path.join(__dirname, '../../uploads', image.originalname);
    }
    const newImage = image == undefined ? null : image.originalname;
    Product.findById(req.params.id).then(result => {
        // console.log(result.image_url);
        const oldUrlImage = result.image_url != null ? result.image_url.split('public/') : null;
        const oldImage = oldUrlImage != null ? oldUrlImage[1] : null;
        const { name, price, stock, status } = req.body;
        let image_url;
        // newimage lebih dulu
        if (oldImage != null) {
            if (newImage != null) {
                if (oldImage != newImage) {
                    fs.unlink(`uploads/${oldImage}`, () => { });
                    fs.renameSync(image.path, target);
                    image_url = `http://localhost:3000/public/${image.originalname}`;
                    console.log(image_url);
                    Product.findByIdAndUpdate(req.params.id, { name, price, stock, status, image_url }).then(result => res.send(Product.findById(result._id))).catch(error => res.send(error));
                }
            } else {
                image_url = `http://localhost:3000/public/${oldImage}`;
                Product.findByIdAndUpdate(req.params.id, { name, price, stock, status, image_url }).then(result => res.send(Product.findById(result._id))).catch(error => res.send(error));
            }
        } else {
            if (newImage != null) {
                fs.unlink(`uploads/${oldImage}`, () => { });
                fs.renameSync(image.path, target);
                image_url = `http://localhost:3000/public/${image.originalname}`;
                Product.findByIdAndUpdate(req.params.id, { name, price, stock, status, image_url }).then(result => res.send(Product.findById(result._id))).catch(error => res.send(error));
            } else {
                Product.findByIdAndUpdate(req.params.id, { name, price, stock, status, image_url }).then(result => res.send(Product.findById(result._id))).catch(error => res.send(error));
            }
        }
    }).catch(error => res.send(error));
}

const destroy = async (req, res) => {
    try {
        const result = await Product.findById(req.params.id);
        const oldUrlImage = result.image_url != null ? result.image_url.split('public/') : null;
        const oldImage = oldUrlImage != null ? oldUrlImage[1] : null;
        if (oldImage !== null) {
            fs.unlink(`uploads/${oldImage}`, () => { });
        }
        Product.deleteOne({ _id: req.params.id })
            .then(result => res.send(result))
            .catch(error => res.send(error));
    } catch (error) {
        console.error(error);
    }
}

const findLike = async (req, res) => {
    try {
        const result = await Product.find({ name: { $regex: req.params.search, $options: "i" } });
        res.send(result);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy,
    findLike
}