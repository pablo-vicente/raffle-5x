import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { RaffledCouponsList } from "../components/RaffledCouponsList";
import { Ticket } from "../components/Ticket";
import { IRaffledCoupon, IRankPartipant, RankDisplay } from "../types";
import { ModalWinner } from "../components/Modal";
import { RaffleContext } from "../contexts/RaffleContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../App";
import useRaffleNumber from "../hooks/RaffleNumber";
import { Rank } from "../components/Rank";


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
    const { raffleInput, raffleSettings } = useContext(RaffleContext);
    const { numberRaffled, inRaffle, start } = useRaffleNumber(
        raffleSettings.RaffleReveal,
        raffleInput.Min,
        raffleInput.Max,
        raffleSettings.DurationSencods);
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

            if (participantCopy.Coupons.length >= raffleSettings.MaxCouponsRaffle)
                raffleCopy.winner = raffledCoupon.Name

            if (raffleCopy.raffleToWinner.first)
                raffleCopy.raffleToWinner.first = false;

            return raffleCopy;
        });

    }, [coupon, inRaffle, numberRaffled, raffleSettings.MaxCouponsRaffle])


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

    let tipe = 1;

    return (

        tipe === 1 ?

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '2vh',
                padding: '2vh',
                flexDirection: 'column'
            }}>


                <Box>
                    <Paper
                        elevation={10}
                    >
                        <Box
                            sx={{
                                height: '50vh',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Box>
                                <Ticket
                                    number={numberRaffled}
                                    name={coupon ? coupon.Name : ""}
                                    golden={!inRaffle && !!coupon}
                                />
                            </Box>
                            <ButtonGroup sx={{
                                paddingTop: '2vh'
                            }}>
                                {buttons}
                            </ButtonGroup>
                        </Box>

                        {
                            raffle.winner
                                ? <ModalWinner name={raffle.winner} />
                                : <></>
                        }

                    </Paper>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: '2vh',
                    }}>

                    <Paper
                        elevation={10}
                        sx={{
                            height: '45vh',
                            overflowY: 'auto',
                            width: '100%'
                        }}>
                        <Rank
                            participants={Object.values(raffle.participants)}
                            display={raffleSettings.RankDisplay}
                            maxRaffle={raffleSettings.MaxCouponsRaffle}
                        />
                    </Paper>

                    <Paper
                        elevation={10}
                        sx={{
                            height: '45vh',
                            overflowY: 'auto',
                            width: '100%'
                        }}>
                        <RaffledCouponsList coupons={Object.values(raffle.coupons)} />
                    </Paper>
                </Box>

            </Box>

            :
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '2vh',
                padding: '2vh',
            }}>
                <Box>

                    <Paper
                        elevation={10}
                        sx={{
                            height: '100%',
                            width: '70vw',
                            display: 'flex',
                            justifyContent: "center"
                        }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: "center"
                            }}
                        >
                            <Box sx={{
                                padding: '2vh'
                            }}>
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

                </Box >

                <Box
                    sx={{
                        width: '30vw',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        gap: '2vh',
                        flexDirection: 'column'
                    }}>
                    <Paper
                        elevation={10}
                        sx={{
                            height: '45vh',
                            overflowY: 'auto',

                        }}>
                        <Rank
                            participants={Object.values(raffle.participants)}
                            display={RankDisplay.MultipleIcons}
                            maxRaffle={raffleSettings.MaxCouponsRaffle}
                        />
                    </Paper>

                    <Paper
                        elevation={10}
                        sx={{
                            height: '45vh',
                            overflowY: 'auto',
                        }}>
                        <RaffledCouponsList coupons={Object.values(raffle.coupons)} />
                    </Paper>

                </Box >
            </Box >
    )
}