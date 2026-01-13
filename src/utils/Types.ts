export type Input = {
    title: string
    month: number
    points: number
    episodes?: number
    review?: string
    year?: number
    genre?: string
    rw?: boolean
}

export type DiaryEntry = {
    title: string
    poster: string 
    points: number
    review: string
}

export type Data = {
    name: string
    value: number
}