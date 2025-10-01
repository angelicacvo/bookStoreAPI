type Role = "admin" | "user"

interface IUser {
    userId : number,
    name: string,
    lastName: string,
    email: string,
    passwordHash: string,
    phone ?: number,
    address: string,
    role: Role,
    createdAt: Date,
    updatedAt: Date,
}

type IAuthUser = Pick<IUser, "email" | "passwordHash" >

export type { IUser, IAuthUser }