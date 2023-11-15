
import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import { coupons, couponsList } from ".././services/dataset";
import { useEffect, useState } from "react";
import { IRaffledCoupon, RaffledCouponsList } from "../components/RaffledCouponsList";
import { Rank, RankDisplay } from "../components/Rank";
import useRaffleNumber, { RaffleRevealNumbers } from "../hooks/RaffleNumber";
import { Ticket } from "../components/Ticket";

export type ICoupon = {
    Code: number,
    Name: string,
};

export function Dashboard() {

    const codes = couponsList.map(x => x.Code);
    const min = Math.min(...codes);
    const max = Math.max(...codes);
    const { numberRaffled, inRaffle, start } = useRaffleNumber(RaffleRevealNumbers.LeftToRight, min, max);
    const [raffledCoupons, setRaffledCoupons] = useState<IRaffledCoupon[]>([]);

    const couponNumber = Number(numberRaffled);
    const coupon = coupons[couponNumber];
    useEffect(() => {

        if (inRaffle)
            return;

        if (!coupon)
            return;

        setRaffledCoupons((pre) => {

            const raffledCouponsCopy = [...pre]
            raffledCouponsCopy.push({
                Code: numberRaffled,
                Name: coupon.Name,
                Time: new Date()
            });

            return raffledCouponsCopy;
        });
    }, [coupon, inRaffle, numberRaffled])



    const buttons = [
        <Button key="one" disabled={inRaffle} onClick={() => {
            start();
        }}>Sortear</Button>,
        <Button key="two" disabled={inRaffle}>Sortear Até Acabar</Button>,
    ];

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'success.main', gap: '1vh', padding: '1vh' }}>
            <Paper sx={{ width: '100%', height: '100vh', overflowY: 'auto', maxWidth: '30%' }}>
                <RaffledCouponsList raffledCoupons={raffledCoupons} />
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
                    raffledCoupons={raffledCoupons}
                    rankDisplay={RankDisplay.MultipleIcons}
                    maxRaffle={5}
                />
            </Paper>
        </Box>
    )
}