var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
module.exports = {
    getAll: function (req, res) {
        Movie.find().populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    //lab tasks
    deleteOne: function(req, res) {
        Movie.deleteOne({_id: req.params.id}, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        })
    },
    deleteActorInMovie: function (req, res) {
        Movie.updateOne({_id: req.params.mId}, {$pull: {actors:req.params.aId}}, function (err, out) {
            if (err) return res.status(400).json(err);
            if (!out) return res.status(404).json();
            return res.json(out);
        })
    },
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },
    getMovieBetweenYear: function (req,res) {
        if (req.params.year1 < req.params.year2) {
            return res.json("year1 must be greater than year2");
        }
        let query = {
            $and: [
                {year: {$lte: req.params.year1}},
                {year: {$gte: req.params.year2}}
            ] 
        }
        Movie.find(query, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        })
    },
    deleteMovieBetweenYear: function (req,res) {
        if (req.body.year1 < req.body.year2) {
            return res.json("year1 must be greater than year2");
        }
        console.log(req.body);
        let query = {
            $and:[
                {year: {$lte: req.body.year1}},
                {year: {$gte: req.body.year2}}
            ]
        }
        Movie.deleteMany(query, function (err, movie) {
            if (err) return res.status(400).json(err);
            return res.json(movie);
        })
    }
};