import { Router } from "express";
import { allNotesContoller , SingleNotesContoller , createNotesContoller,deleteNotesContoller,updateNotesContoller } from "../controller/notes.Contoller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router()


router.post("/notes/:id",authMiddleware,createNotesContoller)
router.get("/notes/:id",authMiddleware,allNotesContoller)
router.get("/notes/:orgId/:noteId",authMiddleware,SingleNotesContoller)
router.patch("/notes/:orgId/:noteId",authMiddleware,updateNotesContoller)
router.delete("/notes/:orgId/:noteId",authMiddleware,deleteNotesContoller)


export default router
