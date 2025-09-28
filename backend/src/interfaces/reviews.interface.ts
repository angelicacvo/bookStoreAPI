type rating = 1 | 2 | 3 | 4 | 5

interface IReview {
    reviewId :number
    bookId :number
    userId :number
    rating: rating
    comment: string
    createdAt: Date
}

export type { IReview }