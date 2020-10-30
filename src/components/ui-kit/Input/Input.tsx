import React from "react";
import classes from "./Input.module.css";
import cn from "clsx";

interface InputProps {
  type: string;
  value: string;
  placeholder: string;
  icon?: string;
  onChange(e: React.SyntheticEvent<HTMLInputElement>): void;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  value,
  placeholder = "",
  icon,
  onChange,
}: InputProps) => {
  return (
    <input
      className={cn(classes.input, {
        [classes.withIcon]: Boolean(icon),
      })}
      style={{ backgroundImage: icon ? `url(${icon})` : "" }}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
