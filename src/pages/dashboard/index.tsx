
import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import { Panel } from "../../components/Panel";
import { Rank } from "../../components/Rank";
import { IRaffledCoupon, RaffledCouponsList } from "../../components/RaffledCouponsList";
import useRaffleCoupon, { RaffleRevealNumbers } from "../../hooks/RaffleCoupon";

export function Dashboard() {
    const { coupon, inRaffle, start } = useRaffleCoupon(RaffleRevealNumbers.LeftToRight, 1, 45000);

    const buttons = [
        <Button key="one" disabled={inRaffle} onClick={() => {
            start();
        }}>Sortear 1</Button>,
        <Button key="two" disabled={inRaffle}>Sortear Até Acabar</Button>,
    ];

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'success.main', gap: '1vh', padding: '1vh' }}>
            <Paper sx={{ width: '100%', height: '100vh', overflowY: 'auto', maxWidth: '30%' }}>
                <RaffledCouponsList raffledCoupons={raffledCoupons} />
            </Paper>

            <Paper elevation={3} sx={{ width: '40%' }}>
                <Panel coupon={coupon} />

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

const raffledCoupons: IRaffledCoupon[] = [
    {
        Code: 4000,
        Name: "507 - HERCILIO SCHATZ"
    },
    {
        Code: 4001,
        Name: "602 - LOURENO"
    },
    {
        Code: 4001,
        Name: "507 - HERCILIO SCHATZ"
    },
    {
        Code: 4001,
        Name: "602 - LOURENO"
    },
    {
        Code: 4002,
        Name: "604 - HAGATA"
    },
    {
        Code: 4003,
        Name: "604 - HAGATA"
    },
    {
        Code: 40,
        Name: "507 - HERCILIO SCHATZ"
    },
]