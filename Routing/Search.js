import { Router } from "express";
import {
  SearchPeolpeByUsername,
  SearchPostsByTitle,
} from "../Controler/Search.js";
import { verifyToken } from "../Middelware/VerifyToken.js";

export const SearchRouter = Router();

SearchRouter.route("/posts/search").get(verifyToken, SearchPostsByTitle);
SearchRouter.route("/people/search").get(verifyToken, SearchPeolpeByUsername);
