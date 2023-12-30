import {
    ListSubheader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import { IRaffledCoupon } from '../types';

export function RaffledCouponsList(
    {
        coupons,
    }:
        {
            coupons: IRaffledCoupon[],
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
                            key={index}
                            secondaryAction={coupon.Time.toLocaleTimeString("pt-BR")}
                        >
                            <ListItemIcon>
                                {coupon.Code}
                            </ListItemIcon>
                            <ListItemText
                                primary={coupon.Name}
                            />
                        </ListItem>
                    )

            }
        </List>
    );
}

