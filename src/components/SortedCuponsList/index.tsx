import {
    ListSubheader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';


export type ISortedCupon = {
    Code: number,
    Name: string
};

export function SortedCuponsList({ sotedCupons }: { sotedCupons: ISortedCupon[] }) {
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
                sotedCupons.map((cupon, index) =>

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

