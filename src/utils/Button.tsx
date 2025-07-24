import React from "react";
import { Button as MuiButton, Tooltip } from "@mui/material";

interface AppButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  className?: string;
  autoFocus?: boolean;
}

const Button: React.FC<AppButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = "contained",
  size = "medium",
  className = "",
  autoFocus = false,
}) => {
  return (
    <Tooltip
      title={disabled ? "You do not have permission" : ""}
      arrow
      disableHoverListener={!disabled}
    >
      <span>
        {/* Wrap in <span> because MUI Button ignores pointer events on disabled button for Tooltip */}
        <MuiButton
          variant={variant}
          size={size}
          className={className}
          onClick={onClick}
          disabled={disabled}
          autoFocus={autoFocus}
        >
          {children}
        </MuiButton>
      </span>
    </Tooltip>
  );
};

export default Button;
