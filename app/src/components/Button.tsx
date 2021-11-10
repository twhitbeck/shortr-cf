import React from "react";

export type Ref = HTMLButtonElement;

const Button = React.forwardRef<Ref, React.ComponentProps<"button">>(
  ({ className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "rounded-lg",
          "shadow-md",
          "p-3",
          "placeholder-gray-400",
          "focus:ring-green-500",
          "focus:ring-2",
          "text-gray-100",
          "bg-green-600",
          "hover:bg-green-700",
          "focus:outline-none",
          "transition",
          disabled && "opacity-50",
          disabled && "hover:bg-green-600",
          disabled && "cursor-not-allowed",
          className,
        ].join(" ")}
        aria-disabled={disabled ? true : undefined}
        {...props}
      >
        {props.children}
      </button>
    );
  }
);

export default Button;
