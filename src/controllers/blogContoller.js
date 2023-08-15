const Blog = require("../models/blogModel");

const create = (req, res, next) => {
    const authorId = req.userId;
    const blog = new Blog({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
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

const getAll = (req, res, next) => {
    return Blog
        .find()
        .then(
            (response) => res.status(200).json({ statusCode: 200, message: 'success', blogs: response}),
            (err) => res.status(500).json(err)
        );
}

const getByID = (req, res, next) => {
    if (req.params.authorId == req.userId) {
        return Blog
            .find({ authorId: req.userId })
            .then(
                (response) => res.status(200).json({ statusCode: 200, message: 'success', blogs: response }),
                (err) => res.status(500).json(err)
            );
    } else {
        return res.status(401).json({ statusCode: 401, message: 'Unauthorised' })
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
        image: req.body.image,
        categories: req.body.categories,
        isPublished: req.body.isPublished,
        authorId
    };
    if (req.params.blogId) {
        return Blog
            .findOneAndUpdate({ _id: req.params.blogId, authorId: req.userId }, blog, { new: true })
            .then((response) => {
                console.log(response)
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


module.exports = { create, getAll, getByID, deleteById, updateById };

