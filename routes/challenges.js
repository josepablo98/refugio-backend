import express from "express";
import {
  getChallenges,
  createChallenge,
  unlockChallenge,
} from "../controllers/challenges.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.get("/", getChallenges);
router.post("/", adminAuth, createChallenge);
router.post("/:id/unlock", unlockChallenge);

export default router;
