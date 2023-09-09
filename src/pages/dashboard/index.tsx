
import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import { Panel } from "../../components/Panel";
import { Rank } from "../../components/Rank";
import { ISortedCupon, SortedCuponsList } from "../../components/SortedCuponsList";
import useRevealCoupon, { RaffleRevealNumbers } from "../../hooks/raffleCoupon";

export function Dashboard() {
    const { coupon, sorting, start } = useRevealCoupon(RaffleRevealNumbers.LeftToRight, 1, 45000);

    const buttons = [
        <Button key="one" disabled={sorting} onClick={() => {
            start();
        }}>Sortear 1</Button>,
        <Button key="two" disabled={sorting}>Sortear Até Acabar</Button>,
    ];

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'success.main', gap: '1vh', padding: '1vh' }}>
            <Paper sx={{ width: '100%', height: '100vh', overflowY: 'auto', maxWidth: '30%' }}>
                <SortedCuponsList sotedCupons={sotedCupons} />
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
                <Rank sotedCupons={sotedCupons} />
            </Paper>
        </Box>
    )
}

const sotedCupons: ISortedCupon[] = [
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