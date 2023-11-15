import {
    Badge,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography
} from "@mui/material";
import {
    AddReactionOutlined,
    SentimentVeryDissatisfied,
} from '@mui/icons-material';
import { IRaffledCoupon } from "./RaffledCouponsList";


export enum RankDisplay {
    MultipleIcons = 1,
    SingleIcon = 2,
}

export function Rank(
    {
        raffledCoupons,
        rankDisplay,
        maxRaffle
    }: {
        raffledCoupons: IRaffledCoupon[],
        rankDisplay: RankDisplay,
        maxRaffle: number
    }) {


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
        const notRaffled = [...Array(maxRaffle - RaffledCoupons)].map(() => false);
        const rank = [...raffled, ...notRaffled];

        return rank;
    }

    function renderParticipant(coupons: number) {
        switch (rankDisplay) {

            case RankDisplay.MultipleIcons:
                return <Box>
                    {
                        generateRank(coupons).map((e, i) => e
                            ? <AddReactionOutlined key={i} sx={{ color: 'success.main' }} />
                            : <SentimentVeryDissatisfied key={i} sx={{ color: 'warning.main' }} />)

                    }
                </Box>

            case RankDisplay.SingleIcon:

                return coupons > 0
                    ? <Badge badgeContent={coupons} color="secondary">
                        <AddReactionOutlined sx={{ color: 'success.main' }} />
                    </Badge>
                    : <SentimentVeryDissatisfied sx={{ color: 'warning.main' }} />
        }
    }

    return (
        <List
            dense={true}
            sx={{ width: '100%' }}
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    <Typography sx={
                        {
                            mt: 4,
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                        variant="h6"
                        component="div"
                    >
                        Participantes
                        <ListItemIcon>
                            {renderParticipant(maxRaffle)}
                        </ListItemIcon>

                    </Typography>
                </ListSubheader>
            }
        >
            {

                participants
                    .sort((a, b) => (a.Coupons > b.Coupons) ? -1 : 1)
                    .map(participant =>
                        <ListItem key={participant.Name}>
                            <ListItemText
                                primary={participant.Name}
                            />
                            <ListItemIcon>
                                {renderParticipant(participant.Coupons)}
                            </ListItemIcon>
                        </ListItem>
                    )
            }
        </List>
    )
}