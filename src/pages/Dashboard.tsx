import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { RaffledCouponsList } from "../components/RaffledCouponsList";
import { Rank, RankDisplay } from "../components/Rank";
import { Ticket } from "../components/Ticket";
import { IRaffledCoupon, IRankPartipant } from "../types";
import { ModalWinner } from "../components/Modal";
import useRaffleNumber, { RaffleRevealNumbers } from "../hooks/RaffleNumber";
import { RaffleContext } from "../contexts/RaffleContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../App";


const maxRaffle = 2;

type IRaffle = {
    coupons: { [key: number]: IRaffledCoupon },
    participants: { [key: string]: IRankPartipant },
    winner: string,
    raffleToWinner: {
        first: boolean,
        keepRaffling: boolean
    }
}

export function Dashboard() {
    const navigate = useNavigate();
    const { raffleInput } = useContext(RaffleContext);
    const { numberRaffled, inRaffle, start } = useRaffleNumber(RaffleRevealNumbers.LeftToRight, raffleInput.Min, raffleInput.Max);
    const [raffle, setRaffle] = useState<IRaffle>({
        coupons: {},
        participants: {},
        winner: "",
        raffleToWinner: {
            first: false,
            keepRaffling: false
        }
    });

    useEffect(() => {

        if (raffleInput.Max === 0)
            navigate("/" + Page.Coupons);

        const rankParticipants: { [key: string]: IRankPartipant } = {};
        Object.keys(raffleInput.Participants)
            .forEach(x => {
                rankParticipants[x] = {
                    Name: x,
                    Coupons: []
                }
            })

        setRaffle((a) => {
            const copy: IRaffle = {
                ...a,
                participants: rankParticipants
            };

            return copy;
        });
    }, [navigate, raffleInput.Max, raffleInput.Participants])

    const couponNumber = Number(numberRaffled);
    const coupon = raffleInput.Coupons[couponNumber]
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
            const raffleCopy: IRaffle = {
                ...raffle,
                raffleToWinner: { ...raffle.raffleToWinner },
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

            if (raffleCopy.raffleToWinner.first)
                raffleCopy.raffleToWinner.first = false;

            return raffleCopy;
        });

    }, [coupon, inRaffle, numberRaffled])


    useEffect(() => {
        if (raffle.raffleToWinner.keepRaffling && !raffle.winner) {
            if (!raffle.raffleToWinner.first)
                wait(1000);
            start();
        }

        function wait(ms: number) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        }
    }, [raffle, start])

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
                    raffleToWinner: {
                        first: true,
                        keepRaffling: true
                    }
                })
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
                        <Ticket
                            number={numberRaffled}
                            name={coupon ? coupon.Name : ""}
                            golden={!inRaffle && !!coupon}
                        />
                    </Box>
                    <ButtonGroup aria-label="medium secondary button group">
                        {buttons}
                    </ButtonGroup>
                </Box>

                {
                    raffle.winner
                        ? <ModalWinner name={raffle.winner} />
                        : <></>
                }
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