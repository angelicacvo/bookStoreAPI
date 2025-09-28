
interface ISubscription {
    subscriptionId: number,
    userId:number,
    planId:number,
    startDate: Date,
    endDate: Date,
    status: 'Active' | 'Expired' | 'Cancelled'
}

export type { ISubscription }