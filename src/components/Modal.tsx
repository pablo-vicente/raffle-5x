import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Modal } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

export function ModalWinner({
    name,
}: {
    name: string,
}) {
    const [open, setOpen] = React.useState(!!name);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            <Modal

                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    border: '2px dashed black',
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'goldenrod',
                    boxShadow: 24,
                    p: 6,
                    borderRadius: '15%'
                }}>
                    <Box
                        className='fa-beat-fade'
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            verticalAlign: 'center',
                            textJustify: 'inter-character',
                        }}>

                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: 'Algerian',
                                padding: '10px 60px',
                                textWrap: 'nowrap',
                                color: 'black'
                            }}>
                            Vencedor
                        </Typography>

                        <FontAwesomeIcon
                            icon={faTrophy}
                            color='black'
                            style={{
                                height: '20em',
                                width: '20em',
                                color: 'lightgoldenrodyellow'
                            }} />

                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: 'Algerian',
                                fontSize: '2em',
                                padding: '0.2em 2em',
                                textWrap: 'textWrap',
                                color: 'black',
                            }}>
                            {name}
                        </Typography>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}