export type IRaffledCoupon = {
    Code: string,
    Name: string,
    Time: Date,
    Repeated : boolean
};

export type IRankPartipant = {
    Name: string,
    Coupons: number,
};

export type ICoupon = {
    Code: number,
    Name: string,
};

export type IRaffleInput = {
    Coupons: { [Key: number]: ICoupon; },
    Participants: { [Key: string]: number; },
    Min: number,
    Max: number,
};

export type IRaffleSettings = {
    RaffleReveal: RaffleRevealNumbers,
    DurationSencods: number,
    RankDisplay: RankDisplay,
    MaxCouponsRaffle: number,
    AllowRepeatCoupon : boolean
}

// EMUNS

export enum ListInput {
    AllCupons = 1,
    Participants = 2
}

export enum RankDisplay {
    MultipleIcons = 1,
    SingleIcon = 2,
}

export enum RaffleRevealNumbers {
    All = 1,
    RightToLeft = 2,
    LeftToRight = 3
}