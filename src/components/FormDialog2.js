import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog2( {approveTransfer, landId} ) {
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
    const address = document.getElementById("address").value;
    // check whether the address is valid
    if (address.length !== 42) {
      alert("Please enter a valid address");
      return;
    }
    if (address.slice(0, 2) !== "0x") {
      alert("Please enter a valid address");
      return;
    }
    setOpen(false);
    approveTransfer(landId, address);
  };


  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Approve transfer
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter the address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please note that only the owner of the current estate has the access to transfer.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="address"
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
    </div>
  );
}