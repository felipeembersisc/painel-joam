import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { CardContent, CardActions, Divider, IconButton, Modal, Typography, Stack } from '@mui/material';

// project imports
import MainCard from '@/ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';

// generate random
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

// modal position
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`
    };
}

// ==============================|| SIMPLE MODAL ||============================== //

export function SimpleModal({ open, setOpen, children, actions, title, ...rest }) {
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);

    const handleClose = () => {
        setOpen(false);
    };

    return (
      <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
         <MainCard
            sx={{
               display: 'flex',
               flexDirection: 'column',
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               ...rest?.style
            }}
            title={title ?? "Titulo"}
            content={false}
            secondary={
               rest?.hiddenClose ?
                  <></>
               :
                  <IconButton onClick={handleClose} size="large">
                     <CloseIcon fontSize="small" />
                  </IconButton>
            }
         >
            <CardContent sx={{flex: 1, overflowY: 'auto'}}>
               {children}
            </CardContent>
            {
               actions &&
               <>
                  <Divider />
                  <CardActions>
                     {actions}
                  </CardActions>
               </>
            }
         </MainCard>
      </Modal>
    );
}