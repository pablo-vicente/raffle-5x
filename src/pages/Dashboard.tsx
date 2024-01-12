import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
    coupons: { [key: number]: IRaffledCoupon[] },
    participants: { [key: string]: IRankPartipant },
}

type IraffleToWinner = {
    winner: string,
    first: boolean,
    keepRaffling: boolean
}

export function Dashboard() {
    const navigate = useNavigate();
    const { raffleInput, raffleSettings } = useContext(RaffleContext);
    const { numberRaffled, inRaffle, start } = useRaffleNumber(
        raffleSettings.RaffleReveal,
        raffleInput.Min,
        raffleInput.Max,
        raffleSettings.DurationSencods);
    const [raffleToWinner, setRaffleToWinner] = useState<IraffleToWinner>({
        winner: "",
        first: false,
        keepRaffling: false
    });
    const { current: raffle } = useRef<IRaffle>(useMemo(() => {

        const rankParticipants: { [key: string]: IRankPartipant } = {};
        Object
            .keys(raffleInput.Participants)
            .forEach(x => {
                rankParticipants[x] = {
                    Name: x,
                    Coupons: 0
                }
            })

        return {
            coupons: {},
            participants: rankParticipants,
        }
    }, [raffleInput.Participants]))

    useEffect(() => {

        if (raffleInput.Max === 0)
            navigate("/" + Page.Coupons);

    }, [navigate, raffleInput.Max])

    const couponNumber = Number(numberRaffled);
    const coupon = raffleInput.Coupons[couponNumber]
    useEffect(() => {

        if (inRaffle)
            return;

        if (!coupon)
            return;


        const repeatedCoupon = !!raffle.coupons[coupon.Code] && raffle.coupons[coupon.Code].length >= 1;
        const raffledCoupon: IRaffledCoupon = {
            Code: numberRaffled,
            Name: coupon.Name,
            Time: new Date(),
            Repeated: repeatedCoupon
        };

        if (repeatedCoupon)
            raffle.coupons[coupon.Code].push(raffledCoupon)
        else
            raffle.coupons[coupon.Code] = [raffledCoupon]

        const participantAtual = raffle.participants[raffledCoupon.Name];


        if (raffleSettings.AllowRepeatCoupon || (!raffleSettings.AllowRepeatCoupon && !repeatedCoupon))
            participantAtual.Coupons++;

        setRaffleToWinner((r) => {

            const copy = {
                ...r
            }

            if (participantAtual.Coupons >= raffleSettings.MaxCouponsRaffle)
                copy.winner = raffledCoupon.Name

            if (copy.first)
                copy.first = false;

            return copy;
        });

    }, [coupon, inRaffle, numberRaffled, raffle, raffleSettings])


    useEffect(() => {
        if (raffleToWinner.keepRaffling && !raffleToWinner.winner) {
            if (!raffleToWinner.first)
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
    }, [raffle, raffleToWinner, start])

    const buttons = [
        <Button
            key="one"
            disabled={inRaffle || !!raffleToWinner.winner}
            onClick={() => {
                start();
            }}
        >
            Sortear
        </Button>,
        <Button
            key="two"
            disabled={inRaffle || !!raffleToWinner.winner}
            onClick={() => {

                setRaffleToWinner((r) => {
                    const copy = {
                        ...r,
                        first: true,
                        keepRaffling: true
                    }
                    return copy;
                })
            }}
        >
            Sortear Até Acabar
        </Button >,
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
                            raffleToWinner.winner
                                ? <ModalWinner name={raffleToWinner.winner} />
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
                        <RaffledCouponsList
                            coupons={Object.values(raffle.coupons).flatMap(x => x)}
                            allowRepeatCoupon={raffleSettings.AllowRepeatCoupon}
                        />
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
                            raffleToWinner.winner
                                ? <ModalWinner name={raffleToWinner.winner} />
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
                        <RaffledCouponsList
                            coupons={Object.values(raffle.coupons).flatMap(x => x)}
                            allowRepeatCoupon={raffleSettings.AllowRepeatCoupon}
                        />
                    </Paper>

                </Box >
            </Box >
    )
}