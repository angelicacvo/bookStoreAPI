
interface IBookCopy {
    bookCopyId : number
    bookId: number
    condition: 'new' | 'good' | 'worn'
    avaiabilityStatus: 'available' | 'borrowed' | 'inactive'
}

export type { IBookCopy }