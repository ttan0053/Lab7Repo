const { json } = require('express');
const mongoose = require('mongoose');
const Actor = require('../models/actor');
const Movie = require('../models/movie');
module.exports = {
    getAll: function (req, res) {
        Actor.find().populate('movies').exec(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        });
    },
    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },
    //lab tasks
    deleteActorWithMovie: function (req, res) {
        let resJson = [];
        Actor.findById({_id:req.params.id}, function(err, actor){
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json(err);
            Movie.deleteMany({_id: {$in: actor.movies}}, function (err, out) {
                resJson.push({"deleteMovie": out});
            })
        })

        Actor.deleteOne({_id: req.params.id}, function (err, result) {
            if (err) return res.status(400).json(err);
            resJson.push({"deleteActor": result});
            //delete each movie 
            return res.json(resJson);
        })
    },
    deleteMovieInActor: function (req, res) {
        Actor.updateOne({_id: req.params.aId}, {$pull: {movies:req.params.mId}}, function (err, out) {
            if (err) return res.status(400).json(err);
            if (!out) return res.status(404).json();
            return res.json(out);
        })
    }
};