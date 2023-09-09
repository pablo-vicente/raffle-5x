import {
    ListSubheader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';


export type IRaffledCoupon = {
    Code: number,
    Name: string,
    Time: Date
};

export function RaffledCouponsList({ raffledCoupons }: { raffledCoupons: IRaffledCoupon[] }) {
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
                raffledCoupons
                    .sort((a, b) => (a.Time.getTime() > b.Time.getTime()) ? -1 : 1)
                    .map((cupon, index) =>

                        <ListItem key={index}>
                            <ListItemIcon>
                                {cupon.Code}
                            </ListItemIcon>
                            <ListItemText
                                primary={cupon.Name}
                            />
                        </ListItem>
                    )

            }
        </List>
    );
}
