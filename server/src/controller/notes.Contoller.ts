import { Response,Request } from "express";
import { deleteNoteService, getAllNotesService, getMembership, getSingleNote, insertInContentTable, updateNotesService } from "../services/notes.services";
import { AuthRequest } from "../types/express";
import { sendError, sendSuccess } from "../utils/apiResponse";

interface data {
    title:string,
    content:string
}
export const createNotesContoller = async (req: AuthRequest, res: Response) => {
  const {id:orgId } = req.params;
  const userId = req.user?.userId;

  const {title,content}:data = req.body
if (!orgId || typeof orgId !== "string") {
  return res.status(400).json({ message: "Organization id is required" });
}


  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isMember = await getMembership({userId,orgId});

  if (!isMember) {
    return res.status(403).json({ message: "You are not a member of this organization" });
  }



  const note = await insertInContentTable({orgId,title,content})


  if(!note){
    return sendError(res,401,'something wend wrong while inserting in notes')
  }
  return sendSuccess(res,200,'Note Created Sussessfully')
};



export const allNotesContoller = async(req:Request,res:Response)=>{

    const {id:orgId } = req.params;
  const userId = req.user?.userId;

if (!orgId || typeof orgId !== "string") {
  return res.status(400).json({ message: "Organization id is required" });
}

 if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

const notes = await  getAllNotesService(orgId,userId)

if(!notes){
  return sendError(res,401,'Not Found')
}
return sendSuccess(res,200,{message:'receved all notes',
  notes
},)
    
}


export const SingleNotesContoller = async(req:Request,res:Response)=>{
     const {orgId } = req.params;
     const {noteId } = req.params;
  const userId = req.user?.userId;

if (!orgId || typeof orgId !== "string") {
  return res.status(400).json({ message: "Organization id is required" });
}

 if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

const notes = await  getSingleNote(orgId,userId)

if(!notes){
  return sendError(res,401,'Not Found')
}


return sendSuccess(res,200,{message:'receved all notes',
  notes
},)
    
    
}


export const updateNotesContoller = async(req:AuthRequest,res:Response)=>{

       const {orgId } = req.params;
     const {noteId } = req.params;
  const userId = req.user?.userId;
  const {title,content}:Partial<data> = req.body;

if (!orgId || typeof orgId !== "string") {
  return res.status(400).json({ message: "Organization id is required" });
}

if (!noteId || typeof noteId !== "string") {
  return res.status(400).json({ message: "Note id is required" });
}

 if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isMember = await getMembership({userId,orgId});

  if (!isMember) {
    return res.status(403).json({ message: "You are not a member of this organization" });
  }

  const updatedNote = await updateNotesService(orgId,noteId,{title,content})

  if(!updatedNote){
    return sendError(res,404,'Note Not Found')
  }

  return sendSuccess(res,200,{message:'Note updated successfully',note:updatedNote})

    
}
export const deleteNotesContoller = async(req:AuthRequest,res:Response)=>{

  
       const {orgId } = req.params;
     const {noteId } = req.params;
  const userId = req.user?.userId;

if (!orgId || typeof orgId !== "string") {
  return res.status(400).json({ message: "Organization id is required" });
}

if (!noteId || typeof noteId !== "string") {
  return res.status(400).json({ message: "Note id is required" });
}

 if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isMember = await getMembership({userId,orgId});

  if (!isMember) {
    return res.status(403).json({ message: "You are not a member of this organization" });
  }

    const deletedNote = await deleteNoteService(orgId,noteId)

    if(!deletedNote){
      return sendError(res,404,'Note Not Found')
    }

    return sendSuccess(res,200,{message:'Note deleted successfully',note:deletedNote})
}
