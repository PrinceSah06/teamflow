import { Router } from "express";
import { validateData } from "../moddleware/validationMiddleware";
import {userRegistrationSchema ,userLoginSchema} from "../schemas/userSchemas"
import { loginUserController, registerUserController ,logoutController } from "../controller/user.Controller"
import { authMiddlware } from "../moddleware/authMiddleware";
import { allowedUser } from "../moddleware/authorizationMiddlware";

const  route = Router()

route.post("/register", validateData(userRegistrationSchema), registerUserController);
route.post("/login", validateData(userLoginSchema), loginUserController);
route.post("/logout",authMiddlware, logoutController);
route.get("/api/orgs/:orgId/test", authMiddlware, allowedUser(["admin", "member"]))
export default route;
