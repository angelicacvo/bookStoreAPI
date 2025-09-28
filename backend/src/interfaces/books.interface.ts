interface IBook {
    bookId: number
    title: string
    author: string
    isbn ?: string  
    genre : string
    language: string
    cover_url: string
    description: string
    ownerId: number
    status: 'available' | 'borrowed' | 'inactive' 
    createdAt: Date
}


export type { IBook }