
type loanStatus = 'active' | 'returned' | 'late' | 'cancelled'

interface ILoan {
    loanId : number
    bookId: number
    userId: number
    loanDate: Date
    returnDate: Date
    actualReturnDate: Date
    status: loanStatus
}

export type { ILoan }