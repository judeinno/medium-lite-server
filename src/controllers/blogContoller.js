const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const multer = require('multer');
const helpers = require("../../src/helper");
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single("image");

const uploadHandler = async (req, res, next) => {
    try {
        await helpers.runMiddleware(req, res, myUploadMiddleware);
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await helpers.handleUpload(dataURI);
        req.image = cldRes.secure_url;
        next()
    } catch (error) {
        console.log(error);
        res.send({
            message: error.message,
        });
    }
};

const create = (req, res, next) => {
    const authorId = req.userId;
    const blog = new Blog({
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        image: req.image,
        categories: req.body.categories,
        isPublished: req.body.isPublished,
        authorId
    });

    return blog
        .save()
        .then(
            (response) => res.status(200).json({ statusCode: 200, message: 'Blog created successfully', blog: response }),
            (err) => res.status(500).json(err)
        );
}

const getAll = async (req, res, next) => {
    try {
        const blogs = await Blog.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    authorIdObjectId: { $toObjectId: '$authorId' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorIdObjectId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: '$author'
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    description: 1,
                    image: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'author.name': 1,
                    'author.email': 1
                }
            }
        ]);
        return res.status(200).json({
            statusCode: 200,
            message: 'success',
            blogs: blogs
        });
    } catch (error) {
        return next(error);
    }
}


const getByID = async (req, res, next) => {
    try {
        if (req.params.blogId) {
            const blog = await Blog.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(req.params.blogId) } },
                {
                    $addFields: {
                        authorIdObjectId: { $toObjectId: '$authorId' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'authorIdObjectId',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                {
                    $unwind: '$author'
                },
                {
                    $project: {
                        title: 1,
                        content: 1,
                        description: 1,
                        image: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        'author._id': 1,
                        'author.name': 1,
                        'author.email': 1
                    }
                }
            ]);

            if (blog.length === 0) {
                return res.status(404).json({ statusCode: 404, message: 'Not found' });
            }

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                blog: blog[0] // Return the first item from the array
            });
        } else {
            return res.status(404).json({ statusCode: 404, message: 'Not found' });
        }
    } catch (error) {
        return next(error);
    }
}


const deleteById = (req, res, next) => {
    if (req.params.blogId) {
        return Blog
            .findByIdAndDelete({ _id: req.params.blogId, authorId: req.userId })
            .then((response) => {
                if (!response) {
                    return res.status(404).json({ statusCode: 404, message: 'Blog not found' })
                } else {
                    return res.status(200).json({ statusCode: 200, message: 'Blog deleted successfully', blog: response })
                }
            })
            .catch((err) => res.status(500).json(err));
    } else {
        return res.status(404).json({ statusCode: 404, message: 'Blog not found' })
    }

}

const updateById = (req, res, next) => {
    const authorId = req.userId;
    const blog = {
        title: req.body.title,
        description: req.body.description,
        image: req.image,
        categories: req.body.categories,
        isPublished: req.body.isPublished,
        authorId
    };
    if (req.params.blogId) {
        return Blog
            .findOneAndUpdate({ _id: req.params.blogId, authorId: req.userId }, blog, { new: true })
            .then((response) => {
                if (!response) {
                    return res.status(404).json({ statusCode: 404, message: 'Blog not found' })
                } else {
                    return res.status(200).json({ statusCode: 200, message: 'Blog successfully updated', blog: response })
                }
            })
            .catch((err) => res.status(500).json(err));
    } else {
        return res.status(404).json({ statusCode: 404, message: 'Blog not found' })
    }
}

const getMyBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.aggregate([
            { $match: { authorId: req.userId } },
            { $sort: { createdAt: -1 } },
            {
                $addFields: {
                    authorIdObjectId: { $toObjectId: '$authorId' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorIdObjectId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: '$author'
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    description: 1,
                    image: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'author.name': 1,
                    'author.email': 1
                }
            }
        ]);
        if (blogs.length === 0) {
            return res.status(200).json({ statusCode: 200, message: 'No Blogs yet, create some', blogs: [] })
        } else {
            return res.status(200).json({ statusCode: 200, message: 'success', blogs: blogs })
        }
    } catch (error) {
        return next(error);
    }

}


module.exports = { create, getAll, getByID, deleteById, updateById, uploadHandler, getMyBlogs };

