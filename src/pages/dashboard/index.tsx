
import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import { Panel } from "../../components/Panel";
import { Rank } from "../../components/Rank";
import { IRaffledCoupon, RaffledCouponsList } from "../../components/RaffledCouponsList";
import useRaffleNumber, { RaffleRevealNumbers } from "../../hooks/RaffleNumber";
import {coupons, couponsList} from "../../services/dataset";
import { useEffect, useState } from "react";

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

    useEffect(() => {

        if (inRaffle)
            return;
        const couponNumber = Number(numberRaffled);
        if (couponNumber === 0)
            return;

        const coupon = coupons[couponNumber];

        setRaffledCoupons((pre) => {

            const raffledCouponsCopy = [...pre]
            raffledCouponsCopy.push({
                Code: coupon.Code,
                Name: coupon.Name,
                Time: new Date()
            });

            return raffledCouponsCopy;
        });
    }, [inRaffle, numberRaffled])



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
                <Panel coupon={numberRaffled} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <ButtonGroup aria-label="medium secondary button group">
                        {buttons}
                    </ButtonGroup>
                </Box>
            </Paper>

            <Paper sx={{ width: '100%', height: '100vh', overflowY: 'auto', maxWidth: '30%' }}>
                <Rank raffledCoupons={raffledCoupons} />
            </Paper>
        </Box>
    )
}