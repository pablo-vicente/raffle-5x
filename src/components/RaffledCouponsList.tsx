import {
    ListSubheader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Chip,
    Box,
} from '@mui/material';
import { IRaffledCoupon } from '../types';

export function RaffledCouponsList(
    {
        coupons,
        allowRepeatCoupon
    }:
        {
            coupons: IRaffledCoupon[],
            allowRepeatCoupon: boolean
        }) {
    return (
        <List
            dense={true}
            sx={{ width: '100%' }}
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Cupons Sorteados
                    </Typography>
                </ListSubheader>
            }
        >
            {
                coupons
                    .sort((a, b) => (a.Time.getTime() > b.Time.getTime()) ? -1 : 1)
                    .map((coupon, index) =>

                        <ListItem
                            sx={
                                !allowRepeatCoupon && coupon.Repeated
                                    ? { textDecoration: 'line-through' }
                                    : {}
                            }
                            key={index}
                            secondaryAction={
                                <Chip
                                    label={coupon.Time.toLocaleTimeString("pt-BR")}
                                    variant="outlined"
                                />
                            }
                        >
                            <ListItemIcon>
                                <Chip
                                    label={coupon.Code}
                                    variant="outlined"
                                />
                            </ListItemIcon>
                            &nbsp;
                            <ListItemText
                                primary={
                                    <Box>
                                        {coupon.Name}
                                        {
                                            !allowRepeatCoupon && coupon.Repeated
                                                ? <>
                                                    &nbsp;
                                                    <Chip
                                                        color='warning'
                                                        label={"Repetido"}
                                                        variant="outlined"
                                                    />
                                                </>
                                                : <></>
                                        }
                                    </Box>
                                }

                            />
                        </ListItem>
                    )

            }
        </List >
    );
}

