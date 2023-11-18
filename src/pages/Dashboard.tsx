
import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import { raffleDataSet } from ".././services/dataset";
import { useEffect, useState } from "react";
import { IRaffledCoupon, RaffledCouponsList } from "../components/RaffledCouponsList";
import { IRankPartipant, Rank, RankDisplay } from "../components/Rank";
import useRaffleNumber, { RaffleRevealNumbers } from "../hooks/RaffleNumber";
import { Ticket } from "../components/Ticket";

export type ICoupon = {
    Code: number,
    Name: string,
};

const maxRaffle = 5;

export function Dashboard() {

    const { numberRaffled, inRaffle, start } = useRaffleNumber(RaffleRevealNumbers.LeftToRight, raffleDataSet.min, raffleDataSet.max);
    const [raffledCoupons, setRaffledCoupons] = useState<{ [key: number]: IRaffledCoupon }>({});

    const couponNumber = Number(numberRaffled);
    const coupon = raffleDataSet.coupons[couponNumber]
    useEffect(() => {

        if (inRaffle)
            return;

        if (!coupon)
            return;

        setRaffledCoupons((pre) => {

            const raffledCouponsCopy = { ...pre }
            const raffledCoupon = {
                Code: numberRaffled,
                Name: coupon.Name,
                Time: new Date()
            };

            raffledCouponsCopy[coupon.Code] = raffledCoupon
            return raffledCouponsCopy;
        });
    }, [coupon, inRaffle, numberRaffled])


    function generateRank() {

        const dictionary: { [key: string]: IRankPartipant } = {};

        raffleDataSet.participants
            .forEach(x => {
                dictionary[x] = {
                    Name: x,
                    Coupons: 0
                }
            })

        Object
            .values(raffledCoupons)
            .forEach(function (raffledCoupon: IRaffledCoupon) {
                dictionary[raffledCoupon.Name].Coupons += 1
            });

        return Object.values(dictionary);
    }



    const buttons = [
        <Button key="one" disabled={inRaffle} onClick={() => {
            start();
        }}>Sortear</Button>,
        <Button key="two" disabled={inRaffle}>Sortear Até Acabar</Button>,
    ];

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'success.main', gap: '1vh', padding: '1vh' }}>
            <Paper sx={{ width: '100%', height: '100vh', overflowY: 'auto', maxWidth: '30%' }}>
                <RaffledCouponsList coupons={Object.values(raffledCoupons)} />
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
                    participants={generateRank()}
                    display={RankDisplay.MultipleIcons}
                    maxRaffle={maxRaffle}
                />
            </Paper>
        </Box>
    )
}