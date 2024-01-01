import React, { createContext, useCallback, useState } from 'react'
import { ICoupon, IRaffleInput, ListInput } from '../types'

type RaffleContextProps = {
    children: React.ReactNode
}

type IRaffleContext = {
    raffleInput: IRaffleInput,
    originalInput: string,
    readRaffleInputFromText: (couponsListRaw: string, listType: ListInput) => string[]
}


export const RaffleContext = createContext<IRaffleContext>({} as IRaffleContext)

export const RaffleContextProvider = ({ children }: RaffleContextProps) => {
    const [originalInput, setOriginalInput] = useState<string>("");
    const [raffleContext, setRaffleContext] = useState<IRaffleInput>({
        Max: 0,
        Min: 0,
        Coupons: {},
        Participants: {}
    });

    const setNewRaffleInput = useCallback((couponsListRaw: string, listType: ListInput): string[] => {

        setOriginalInput(couponsListRaw);

        let result;
        switch (listType) {
            case ListInput.AllCupons:
                result = readCouponsFromText(couponsListRaw);
                break;
            case ListInput.Participants:
                result = generateCouponsFromText(couponsListRaw);
                break
        }

        if (Array.isArray(result)) {

            setRaffleContext({
                Max: 0,
                Min: 0,
                Coupons: {},
                Participants: {}
            });

            return result;
        }

        setRaffleContext(result);

        return [];
    }, [])

    return <RaffleContext.Provider value={{
        raffleInput: raffleContext,
        readRaffleInputFromText: setNewRaffleInput,
        originalInput: originalInput
    } as IRaffleContext}>
        {children}
    </RaffleContext.Provider>
}


function readCouponsFromText(couponsListRaw: string): IRaffleInput | string[] {

    let errors: string[] = [];

    let raffleInput: IRaffleInput = {
        Coupons: {},
        Participants: {},
        Min: Number.MAX_SAFE_INTEGER,
        Max: Number.MIN_SAFE_INTEGER,
    }

    if (!couponsListRaw)
        return errors;

    const lines = couponsListRaw.trim().split("\n");

    for (let index = 0; index < lines.length; index++) {
        const element = lines[index].trim();

        if (!element)
            continue;

        const parts = element.split(",");
        if (parts.length !== 2) {
            errors.push(`Linha ${index + 1}: Formato inválido (esperado CUPON,NOME)`);
            continue;
        }

        const partNumber = parts[0].trim();
        const partname = parts[1].trim();
        const number = Number(partNumber);
        const repeated = !!raffleInput.Coupons[number];

        if (!number || number <= 0)
            errors.push(`Linha ${index + 1}: Cupom: '${partNumber}' inválido (cupom deve ser um número maior do que 0).`);

        if (!partname)
            errors.push(`Linha ${index + 1}: Nome: está em branco.`);

        if (repeated)
            errors.push(`Linha ${index + 1}: Cupom: '${number}' já foi adicionado (cupom repetido).`);

        if (!number || !partname || repeated)
            continue;

        const coupon: ICoupon = {
            Code: number,
            Name: partname
        }


        if (coupon.Code > raffleInput.Max)
            raffleInput.Max = coupon.Code;

        if (coupon.Code < raffleInput.Min)
            raffleInput.Min = coupon.Code

        raffleInput.Coupons[number] = coupon;
        const couponsParticipant = raffleInput.Participants[coupon.Name];
        raffleInput.Participants[coupon.Name] = couponsParticipant
            ? couponsParticipant + 1
            : 1

    }
    const keys = Object
        .keys(raffleInput.Coupons)
        .length;

    if (keys !== raffleInput.Max && raffleInput.Max > 0)
        errors.push(`O maior cupom é '${raffleInput.Max}', mas foram encontrados apenas '${keys}' cupons.`)

    return errors.length === 0
        ? raffleInput
        : errors;
}

function generateCouponsFromText(couponsListRaw: string): IRaffleInput | string[] {
    let errors: string[] = [];

    let raffleInput: IRaffleInput = {
        Coupons: {},
        Participants: {},
        Min: Number.MAX_SAFE_INTEGER,
        Max: Number.MIN_SAFE_INTEGER,
    }

    if (!couponsListRaw)
        return errors;

    const lines = couponsListRaw.trim().split("\n");

    for (let index = 0; index < lines.length; index++) {
        const element = lines[index].trim();

        if (!element)
            continue;

        const parts = element.split(",");
        if (parts.length !== 2) {
            errors.push(`Linha ${index + 1}: Formato inválido (esperado NOME,CUPONS)`);
            continue;
        }

        const partname = parts[0].trim();
        const partNumber = parts[1].trim();
        const numberOfCoupons = Number(partNumber);
        const repeated = !!raffleInput.Participants[partname];

        if (!partname)
            errors.push(`Linha ${index + 1}: Nome: está em branco.`);

        if (!numberOfCoupons || numberOfCoupons <= 0)
            errors.push(`Linha ${index + 1}: Quantidade de Cupons: '${partNumber}' inválida (cupons devem ser um número maior do que 0).`);

        if (repeated)
            errors.push(`Linha ${index + 1}: Nome: '${partname}' já foi adicionado (nome repetido).`);

        if (!numberOfCoupons || !partname || repeated)
            continue;

        raffleInput.Participants[partname] = numberOfCoupons;
    }

    if (errors.length !== 0)
        return errors;

    const participantsRandonNumber = Object
        .entries(raffleInput.Participants)
        .flatMap(([name, coupons]) => {

            return [...Array(coupons).keys()]
                .map(_ => {
                    return {
                        name: name,
                        randon: Math.random()
                    }
                })
        })
        .sort((a, b) => (a.randon > b.randon) ? -1 : 1);

    participantsRandonNumber
        .forEach((p, i) => {

            const coupon: ICoupon = {
                Code: i + 1,
                Name: p.name
            }
            raffleInput.Coupons[coupon.Code] = coupon;
        });


    raffleInput.Min = 1;
    raffleInput.Max = participantsRandonNumber.length;

    return raffleInput;
}