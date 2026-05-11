import { db } from "../db";
import { inviteTokens, member, notes, organizations } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { sendError } from "../utils/apiResponse";

interface insertType{
    orgId:string,
    title:string,
    content:string
}
interface updateDbType{
      title?:string,
    content?:string
}
interface getMembershipType{
    userId:string,orgId:string
}
export const getMembership= async({userId,orgId}:getMembershipType):Promise<boolean>=>{

    const user = await db.query.member.findFirst({where:and(
        eq(member.userId ,userId),
        eq(member.orgId ,orgId)
    ),});

    return !!user
}

export const insertInContentTable =async({orgId,title,content}:insertType)=>{

    const inserteddata =  await db.insert(notes).values({
        content,title,orgId
    }).returning()


    return inserteddata
}

export const getAllNotesService = async(orgId:string,userId:string)=>{

    const allNotes = await db.query.notes.findMany({
      where:and(
        eq(notes.orgId ,orgId)
      ) 
    })

    return allNotes

}
export const getSingleNote = async(orgId:string,userId:string)=>{

    const allNotes = await db.query.notes.findFirst({
      where:and(
        eq(notes.orgId ,orgId)
      ) 
    })

    return allNotes

}

export const updateNotesService = async(orgId:string,noteId:string,data:updateDbType)=>{

    const updatedNote = await db.update(notes).set({
        ...data,
        updatedAt:new Date()
    }).where(and(
        eq(notes.id,noteId),
        eq(notes.orgId,orgId)
    )).returning()

    return updatedNote[0]

}

export const deleteNoteService = async(orgId:string,noteId:string)=>{

    const deletedNote = await db.delete(notes).where(and(
        eq(notes.id,noteId),
        eq(notes.orgId,orgId)
    )).returning()

    return deletedNote[0]

}

export const deleteNotesService = async (orgId:string,noteId:string)=>{

    const note = await db.query.notes.findFirst({
        where:and(
            eq(notes.orgId,orgId),
            eq(notes.id,noteId
            )
        )
    })


if (!note) {
  return {message:"Not found"}
}

// 2. Delete
  const isDelete = await db.delete(notes).where(eq(notes.id, noteId));

// 3. Response
return isDelete
}
