
import express, { json } from "express";
import mongoose from "mongoose";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get('/',async(req,res) => {
    try{
        const response = await RecipeModel.find({})//for all doc
        res.json(response);

    }catch(err){
        res.json(err);
    }
});

router.post('/',verifyToken,async(req,res) => {
    const recipe = new RecipeModel(req.body);
    try{
        const response = await recipe.save();
        res.json(response);

    }catch(err){
        res.json(err);
    }
});
router.put("/", verifyToken, async (req, res) => {
  const recipe = await RecipeModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/savedRecipes/ids/:userID",async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.userID);
        res.json({savedRecipes: user?.savedRecipes})

    }catch(err){
        res.json(err);
    }
})

router.delete("/savedRecipes/:userID/:recipeID", async (req, res) => {
    try {
      const user = await UserModel.findByIdAndUpdate(
        req.params.userID,
        { $pull: { savedRecipes: req.params.recipeID } },
        { new: true }
      );
      res.json({ savedRecipes: user.savedRecipes });
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.get("/savedRecipes/:userID",async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({
            _id: {$in: user.savedRecipes},
        });
        res.json({savedRecipes});

    }catch(err){
        res.json(err);
    }
})

export {router as recipesRouter };