type name = 'basic' | 'premium'
type price = 'Month' | 'Anual'

interface ISubscriptionPlans {
    subscriptionPlanId: number
    name: name
    price: price
    max_books_per_month: number
    description: string
}

export type { ISubscriptionPlans }


