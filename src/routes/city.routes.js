import { Router } from "express";
import cityController from "../controllers/city.controller.js";
import { creatCityValidator } from "../validators/city.validator.js";

const router = Router();

router.post('/', creatCityValidator, cityController.create);

export default router;