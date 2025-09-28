type type = 'loan_request' | 'loan_due'

interface INotification{
    notificationId : number
    userId: number
    type: type
    message: string
    read: boolean
    created_at: Date
}

export type { INotification }