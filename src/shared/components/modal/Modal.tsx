import { ReactNode } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Divider, useMediaQuery, useTheme } from '@mui/material';

interface MyModalProps {
    children: ReactNode;
    open: boolean;
    onClose: () => void;
    titulo: string
  }

export const MyModal: React.FC<MyModalProps> = ({ children, open, onClose, titulo }) => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));
    const modalWidth = smDown ? '80%' : mdDown ? '80%' : '80%';

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: modalWidth,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        p: 2,
      };

  return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h6" sx={{fontWeight: 'bold'}}>
              {titulo}
            </Typography>
            <Divider color='0C68F0' sx={{marginY: 3}}/>
            <Typography id="transition-modal-description" sx={{ mt: 3, textAlign: 'center' }}>
              {children}
            </Typography>
          </Box>
        </Fade>
      </Modal>
  );
}