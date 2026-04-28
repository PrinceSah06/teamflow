import z, { email } from 'zod'

export const userRegistrationSchema = z.object({
    email:z.string().email(),
    password:z.string().min(4)
})
export const userLoginSchema = z.object({
     email:z.string().email(),
    password:z.string().min(4)
})