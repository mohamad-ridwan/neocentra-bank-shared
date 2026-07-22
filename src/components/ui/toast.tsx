import React from "react";
import { useSelector } from "react-redux";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ theme, ...props }: ToasterProps) => {
  let reduxTheme: "light" | "dark" = "dark";
  try {
    // Safely attempt to read theme mode from redux state
    reduxTheme = useSelector((state: any) => state.theme?.mode) || "dark";
  } catch (e) {
    // Fail-safe default if useSelector is rendered outside of Provider or during SSR
  }

  const activeTheme = theme || reduxTheme;

  return (
    <Sonner
      theme={activeTheme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:font-medium",
          success:
            "group-[.toaster]:bg-emerald-950/90 group-[.toaster]:text-emerald-400 group-[.toaster]:border-emerald-800/80 [&_[data-icon]]:text-emerald-400",
          error:
            "group-[.toaster]:bg-red-950/90 group-[.toaster]:text-red-400 group-[.toaster]:border-red-800/80 [&_[data-icon]]:text-red-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
export type { ToasterProps };
