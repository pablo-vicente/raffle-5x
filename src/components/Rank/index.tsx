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
import { ISortedCupon } from "../SortedCuponsList";

export function Rank({ sotedCupons }: { sotedCupons: ISortedCupon[] }) {

    const maxSorted = 5;

    const dictionary: { [key: string]: number } = {};

    sotedCupons.forEach(x => {
        const atual = !dictionary[x.Name] ? 0 : dictionary[x.Name]
        dictionary[x.Name] = atual + 1
    })

    const participants = Object
        .entries(dictionary)
        .map(function (x) {

            return {
                Name: x[0],
                Cupons: x[1]
            }
        });



    function generateRank(SortedCupons: number) {

        const sorted = [...Array(SortedCupons)].map(() => true);
        const notSorted = [...Array(maxSorted - SortedCupons)].map(() => false);
        const rank = [...sorted, ...notSorted];

        return rank;
    }
    return (
        <List
            dense={true}
            sx={{ width: '100%' }}
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Rank Participantes
                    </Typography>
                </ListSubheader>
            }
        >
            {

                participants.sort((a, b) => (a.Cupons > b.Cupons) ? -1 : 1).map(partipant =>
                    <ListItem key={partipant.Name}
                    // secondaryAction={
                    //     // partipant.Cupons > 0
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
                                generateRank(partipant.Cupons).map((e, i) => e
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