import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#78C841] focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#78C841] text-white shadow-sm hover:bg-[#6bb03a] focus-visible:ring-[#78C841]",
        destructive:
          "bg-[#FB4141] text-white shadow-sm hover:bg-[#e63a3a] focus-visible:ring-[#FB4141]",
        outline:
          "border border-gray-300 bg-background shadow-sm hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-[#78C841]",
        secondary:
          "bg-[#B4E50D] text-gray-900 shadow-sm hover:bg-[#a3d40c] focus-visible:ring-[#B4E50D]",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-[#78C841]",
        link: "text-[#78C841] underline-offset-4 hover:underline focus-visible:ring-[#78C841]",
        accent: "bg-[#FF9B2F] text-white shadow-sm hover:bg-[#e88a28] focus-visible:ring-[#FF9B2F]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
