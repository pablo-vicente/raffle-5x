import {
    Badge,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography
} from "@mui/material";
import {
    SentimentSatisfiedOutlined,
    SentimentVeryDissatisfied,
} from '@mui/icons-material';
import { IRankPartipant, RankDisplay } from "../types";

function generateRank(maxRaffle: number, raffledCoupons: number) {

    const raffledAdj = raffledCoupons > maxRaffle ? maxRaffle : raffledCoupons;
    const raffled = [...Array(raffledAdj)].map(() => true);
    const notRaffled = [...Array(maxRaffle - raffledAdj)].map(() => false);
    const rank = [...raffled, ...notRaffled];

    return rank;
}


export function renderParticipant(display: RankDisplay, maxRaffle: number, coupons: number) {
    switch (display) {

        case RankDisplay.MultipleIcons:
            return <>
                {
                    generateRank(maxRaffle, coupons).map((e, i) => e
                        ? <SentimentSatisfiedOutlined key={i} sx={{ color: 'success.main' }} />
                        : <SentimentVeryDissatisfied key={i} sx={{ color: 'warning.main' }} />)

                }
            </>

        case RankDisplay.SingleIcon:

            return coupons > 0
                ? <Badge badgeContent={coupons} color="secondary">
                    <SentimentSatisfiedOutlined sx={{ color: 'success.main' }} />
                </Badge>
                : <SentimentVeryDissatisfied sx={{ color: 'warning.main' }} />
    }
}

export function Rank(
    {
        participants,
        display,
        maxRaffle
    }: {
        participants: IRankPartipant[],
        display: RankDisplay,
        maxRaffle: number
    }) {

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
                            {renderParticipant(display, maxRaffle, maxRaffle)}
                        </ListItemIcon>

                    </Typography>
                </ListSubheader>
            }
        >
            {

                participants
                    .sort((a, b) => {

                        if (a.Coupons.length === b.Coupons.length)
                            return (a.Name > b.Name) ? 1 : -1

                        return (a.Coupons.length > b.Coupons.length) ? -1 : 1
                    })
                    .map(participant =>
                        <ListItem key={participant.Name}>
                            <ListItemText
                                primary={participant.Name}
                            />
                            <ListItemIcon>
                                {renderParticipant(display, maxRaffle, participant.Coupons.length)}
                            </ListItemIcon>
                        </ListItem>
                    )
            }
        </List>
    )
}