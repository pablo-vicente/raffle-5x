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
import { IRankPartipant } from "../types";

export enum RankDisplay {
    MultipleIcons = 1,
    SingleIcon = 2,
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

    function generateRank(raffledCoupons: number) {

        const raffledAdj = raffledCoupons > maxRaffle ? maxRaffle : raffledCoupons;
        const raffled = [...Array(raffledAdj)].map(() => true);
        const notRaffled = [...Array(maxRaffle - raffledAdj)].map(() => false);
        const rank = [...raffled, ...notRaffled];

        return rank;
    }

    function renderParticipant(coupons: number) {
        switch (display) {

            case RankDisplay.MultipleIcons:
                return <>
                    {
                        generateRank(coupons).map((e, i) => e
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
                                {renderParticipant(participant.Coupons.length)}
                            </ListItemIcon>
                        </ListItem>
                    )
            }
        </List>
    )
}