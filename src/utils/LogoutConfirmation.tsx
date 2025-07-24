"use client";
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Button from "./Button";

interface LogoutConfirmationProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="logout-confirmation-title"
      aria-describedby="logout-confirmation-description"
    >
      <DialogTitle id="logout-confirmation-title">
        Logout Confirmation
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-confirmation-description">
          Are you sure you want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} className=" !px-4 !py-1 " variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => {
            console.log("✅ Modal logout button clicked");
            onConfirm();
          }}
          className="bg-gradient-to-r from-red-400 to-red-700 !px-4 !py-1 "
          variant="contained"
          autoFocus={true}
        >
          Yes, Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmation;
