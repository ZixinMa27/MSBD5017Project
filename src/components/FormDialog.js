import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog( {reviseCost, currentCost} ) {
  const [open, setOpen] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    const revisedCost = document.getElementById('name').value;
    console.log(revisedCost)
    let success;
    try {
      success = reviseCost(revisedCost);
    }
    catch (err) {
      console.log(err);
    }

  };


  // alert not in affect
  const [openAlert, setOpenAlert] = React.useState(false);
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };


  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Change Cost
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter the cost of purchase</DialogTitle>
        <DialogContent>
          <DialogContentText>
            1 AXM = 1 * 10^18 Mol
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Mol"

            fullWidth
          />
        </DialogContent> 
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Sumbit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}