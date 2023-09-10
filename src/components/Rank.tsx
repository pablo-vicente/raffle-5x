import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
    Typography
} from "@mui/material";
import {
    AddReactionOutlined,
    SentimentVeryDissatisfied,
} from '@mui/icons-material';
import { IRaffledCoupon } from "./RaffledCouponsList";

export function Rank({ raffledCoupons }: { raffledCoupons: IRaffledCoupon[] }) {

    const maxRaffled = 5;

    const dictionary: { [key: string]: number } = {};

    raffledCoupons.forEach(x => {
        const current = !dictionary[x.Name] ? 0 : dictionary[x.Name]
        dictionary[x.Name] = current + 1
    })

    const participants = Object
        .entries(dictionary)
        .map(function (x) {

            return {
                Name: x[0],
                Coupons: x[1]
            }
        });



    function generateRank(RaffledCoupons: number) {

        const raffled = [...Array(RaffledCoupons)].map(() => true);
        const notRaffled = [...Array(maxRaffled - RaffledCoupons)].map(() => false);
        const rank = [...raffled, ...notRaffled];

        return rank;
    }
    return (
        <List
            dense={true}
            sx={{ width: '100%' }}
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Participantes
                    </Typography>
                </ListSubheader>
            }
        >
            {

                participants.sort((a, b) => (a.Coupons > b.Coupons) ? -1 : 1).map(partipant =>
                    <ListItem key={partipant.Name}
                    // secondaryAction={
                    //     // partipant.Coupons > 0
                    //     //     ? <Badge badgeContent={partipant.Cupons} color="secondary">
                    //     //         <AddReactionOutlined sx={{ color: 'success.main' }} />
                    //     //     </Badge>
                    //     //     : <SentimentVeryDissatisfied sx={{ color: 'warning.main' }} />
                    // }
                    >
                        <ListItemText
                            primary={partipant.Name}
                        />
                        <ListItemAvatar>
                            {
                                generateRank(partipant.Coupons).map((e, i) => e
                                    ? <AddReactionOutlined key={i} sx={{ color: 'success.main' }} />
                                    : <SentimentVeryDissatisfied key={i} sx={{ color: 'warning.main' }} />)
                            }


                        </ListItemAvatar>
                    </ListItem>
                )
            }
        </List>
    )
}