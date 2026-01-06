export type Input = {
    title: string
    month: number
    points: number
    episodes?: number
    review?: string
    year?: number
    genre?: string
}

export type DiaryEntry = {
    title: string
    poster: string | null
    points: number
    review: string
}

export type Data = {
    name: string
    value: number
}