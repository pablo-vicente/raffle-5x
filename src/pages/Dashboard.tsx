import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import { raffleDataSet } from ".././services/dataset";
import { useEffect, useState } from "react";
import { RaffledCouponsList } from "../components/RaffledCouponsList";
import { Rank, RankDisplay } from "../components/Rank";
import useRaffleNumber, { RaffleRevealNumbers } from "../hooks/RaffleNumber";
import { Ticket } from "../components/Ticket";
import { IRaffledCoupon, IRankPartipant } from "../types";


const maxRaffle = 5;

type Raffle = {
    coupons: { [key: number]: IRaffledCoupon },
    participants: { [key: string]: IRankPartipant },
    winner: string,
    raffleToWinner: boolean
}

export function Dashboard() {

    const { numberRaffled, inRaffle, start } = useRaffleNumber(RaffleRevealNumbers.LeftToRight, raffleDataSet.min, raffleDataSet.max);
    const [raffle, setRaffle] = useState<Raffle>({
        coupons: {},
        participants: {},
        winner: "",
        raffleToWinner: false
    });

    const couponNumber = Number(numberRaffled);
    const coupon = raffleDataSet.coupons[couponNumber]

    useEffect(() => {

        const rankParticipants: { [key: string]: IRankPartipant } = {};
        raffleDataSet.participants
            .forEach(x => {
                rankParticipants[x] = {
                    Name: x,
                    Coupons: []
                }
            })

        setRaffle((a) => {
            const copy: Raffle = {
                ...a,
                participants: rankParticipants
            };

            return copy;
        });
    }, [])

    useEffect(() => {

        if (inRaffle)
            return;

        if (!coupon) {

            return;
        }

        setRaffle((raffle) => {

            const raffledCoupon = {
                Code: numberRaffled,
                Name: coupon.Name,
                Time: new Date()
            };

            const raffledCouponsCopy = { ...raffle.coupons }
            const participantsCopy = { ...raffle.participants };
            const raffleCopy: Raffle = {
                ...raffle,
                coupons: raffledCouponsCopy,
                participants: participantsCopy
            };

            raffledCouponsCopy[coupon.Code] = raffledCoupon

            const participantAtual = participantsCopy[raffledCoupon.Name];
            const participantCopy: IRankPartipant = {
                ...participantAtual,
                Coupons: [...participantAtual.Coupons]
            };
            participantCopy.Coupons.push(raffledCoupon);
            participantsCopy[raffledCoupon.Name] = participantCopy;

            if (participantCopy.Coupons.length >= maxRaffle)
                raffleCopy.winner = raffledCoupon.Name

            if (raffleCopy.raffleToWinner && !raffleCopy.winner)
                start();

            return raffleCopy;
        });

    }, [coupon, inRaffle, numberRaffled, raffle.raffleToWinner, start])


    const buttons = [
        <Button
            key="one"
            disabled={inRaffle || !!raffle.winner}
            onClick={() => {
                start();
            }}
        >Sortear</Button>,
        <Button
            key="two"
            disabled={inRaffle || !!raffle.winner}
            onClick={() => {

                setRaffle({
                    ...raffle,
                    raffleToWinner: true
                })
                start();
            }}
        >Sortear Até Acabar</Button>,
    ];

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'success.main', gap: '1vh', padding: '1vh' }}>
            <Paper sx={{ width: '100%', height: '100vh', overflowY: 'auto', maxWidth: '30%' }}>
                <RaffledCouponsList coupons={Object.values(raffle.coupons)} />
            </Paper>

            <Paper elevation={3} sx={{ width: '40%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ padding: '2vh' }}>
                        <Ticket number={numberRaffled} name={coupon ? coupon.Name : ""} />
                    </Box>
                    <ButtonGroup aria-label="medium secondary button group">
                        {buttons}
                    </ButtonGroup>
                </Box>
            </Paper>

            <Paper sx={{ width: '100%', height: '100vh', overflowY: 'auto', maxWidth: '30%' }}>
                <Rank
                    participants={Object.values(raffle.participants)}
                    display={RankDisplay.MultipleIcons}
                    maxRaffle={maxRaffle}
                />
            </Paper>
        </Box>
    )
}