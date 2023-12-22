export type IRaffledCoupon = {
    Code: string,
    Name: string,
    Time: Date
};

export type IRankPartipant = {
    Name: string,
    Coupons: IRaffledCoupon[],
};

export type ICoupon = {
    Code: number,
    Name: string,
};

export type IRaffleInput = {
    Coupons: { [Key: number]: ICoupon; },
    Participants: { [Key: string]: number; },
    Min: number,
    Max: number
};