import {
    Box,
    Paper,
    Typography,
} from "@mui/material";


export function Panel({ coupon }: { coupon: number | string }) {
    return (

        <Box sx={{ padding: '2vh' }}>
            <Paper elevation={3} sx={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h1" sx={{ fontFamily: 'Algerian' }}>
                    {coupon}
                </Typography>
            </Paper>
        </Box>
    )
}