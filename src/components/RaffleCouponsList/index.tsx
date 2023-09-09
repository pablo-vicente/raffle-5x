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
    Name: string
};

export function RaffleCouponsList({ raffledCoupons }: { raffledCoupons: IRaffledCoupon[] }) {
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
                raffledCoupons.map((cupon, index) =>

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

