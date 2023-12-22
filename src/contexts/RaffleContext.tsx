import React, { createContext, useState } from 'react'
import { ICoupon, IRaffleInput } from '../types'

type RaffleContextProps = {
    children: React.ReactNode
}

type IRaffleContext = {
    raffleInput: IRaffleInput,
    generateFromCouponsList: (couponsListRaw: string) => string[]
}

export const RaffleContext = createContext({} as IRaffleContext)

export const RaffleContextProvider = ({ children }: RaffleContextProps) => {
    const [raffleContext, setRaffleContext] = useState<IRaffleInput>({} as IRaffleInput);

    const setNewRaffleInput = (couponsListRaw: string): string[] => {

        const result = generaFromCouponsList(couponsListRaw);

        setRaffleContext(result.RaffleDataSet);

        return result.Errors;
    };

    return <RaffleContext.Provider value={{
        raffleInput: raffleContext,
        generateFromCouponsList: setNewRaffleInput
    } as IRaffleContext}>
        {children}
    </RaffleContext.Provider>
}


function generaFromCouponsList(couponsListRaw: string): {
    RaffleDataSet: IRaffleInput,
    Errors: string[]
} {

    let result: {
        RaffleDataSet: IRaffleInput,
        Errors: string[]
    } = {
        Errors: [],
        RaffleDataSet: {
            Coupons: {},
            Participants: {},
            Min: Number.MAX_SAFE_INTEGER,
            Max: Number.MIN_SAFE_INTEGER,
        }
    };
    if (!couponsListRaw)
        return result;

    const lines = couponsListRaw.trim().split("\n");

    for (let index = 0; index < lines.length; index++) {
        const element = lines[index].trim()

        if (!element)
            continue;

        const parts = element.split(",");
        if (parts.length !== 2) {
            result.Errors.push(`Linha ${index + 1}: Valor: '${element}' formato inválido (esperado [CUPON][,][NOME])`);
            continue;
        }

        const partNumber = parts[0].trim();
        const partname = parts[1].trim();
        const number = Number(partNumber);
        const repeated = !!result.RaffleDataSet.Coupons[number];

        if (!number || number <= 0)
            result.Errors.push(`Linha ${index + 1}: Cupom: '${partNumber}' não é número inválido (cupom deve ser um número maior do que 0).`);

        if (!partname)
            result.Errors.push(`Linha ${index + 1}: Nome: está em branco.`);

        if (repeated)
            result.Errors.push(`Linha ${index + 1}: Cupom: '${number}' já foi adicionado (cupom repetido).`);

        if (!number || !partname || repeated)
            continue;

        const coupon: ICoupon = {
            Code: number,
            Name: partname
        }


        if (coupon.Code > result.RaffleDataSet.Max)
            result.RaffleDataSet.Max = coupon.Code;

        if (coupon.Code < result.RaffleDataSet.Min)
            result.RaffleDataSet.Min = coupon.Code

        result.RaffleDataSet.Coupons[number] = coupon;
        const couponsParticipant = result.RaffleDataSet.Participants[coupon.Name];
        result.RaffleDataSet.Participants[coupon.Name] = couponsParticipant
            ? couponsParticipant + 1
            : 1

    }
    const keys = Object
        .keys(result.RaffleDataSet.Coupons)
        .length;

    if (keys !== result.RaffleDataSet.Max)
        result.Errors.push(`O maior cupom é '${result.RaffleDataSet.Max}', mas foram encontrados apenas '${keys}' cupons.`)


    return result;
}