import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { userLoginSchema, userRegistrationSchema } from "../schemas/userSchemas";
import {
  loginUserController,
  logoutController,
  registerUserController,
} from "../controller/user.Controller";
import { authMiddleware } from "../middleware/authMiddleware";

const route = Router();

route.post("/register", validateData(userRegistrationSchema), registerUserController);
route.post("/login", validateData(userLoginSchema), loginUserController);
route.post("/logout", authMiddleware, logoutController);

export default route;
