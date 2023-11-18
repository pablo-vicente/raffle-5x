import {
    ListSubheader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';


export type IRaffledCoupon = {
    Code: string,
    Name: string,
    Time: Date
};

export function RaffledCouponsList(
    {
        Coupons,
    }:
        {
            Coupons: IRaffledCoupon[],
        }) {
    return (
        <List
            dense={true}
            sx={{ width: '100%', maxWidth: 360, }}
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Cupons Sorteados
                    </Typography>
                </ListSubheader>
            }
        >
            {
                Coupons
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

