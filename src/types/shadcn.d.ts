
import { ComponentPropsWithoutRef, ElementRef, ReactElement, ReactNode } from "react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

// Common shadcn component props
declare global {
  namespace React {
    interface ComponentProps {
      className?: string;
      children?: ReactNode;
    }
  }
}

// For Radix UI components that need to accept children
declare module "@radix-ui/react-accordion" {
  interface AccordionItemProps extends React.ComponentProps {}
  interface AccordionTriggerProps extends React.ComponentProps {}
  interface AccordionContentProps extends React.ComponentProps {}
  interface AccordionHeaderProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-alert-dialog" {
  interface AlertDialogOverlayProps extends React.ComponentProps {}
  interface AlertDialogTitleProps extends React.ComponentProps {}
  interface AlertDialogDescriptionProps extends React.ComponentProps {}
  interface AlertDialogActionProps extends React.ComponentProps {}
  interface AlertDialogCancelProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-avatar" {
  interface AvatarProps extends React.ComponentProps {}
  interface AvatarImageProps extends React.ComponentProps {}
  interface AvatarFallbackProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-checkbox" {
  interface CheckboxIndicatorProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-dialog" {
  interface DialogProps extends React.ComponentProps {}
  interface DialogContentProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-hover-card" {
  interface HoverCardContentProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-label" {
  interface LabelProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-navigation-menu" {
  interface NavigationMenuProps extends React.ComponentProps {}
  interface NavigationMenuListProps extends React.ComponentProps {}
  interface NavigationMenuTriggerProps extends React.ComponentProps {}
  interface NavigationMenuViewportProps extends React.ComponentProps {}
  interface NavigationMenuIndicatorProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-popover" {
  interface PopoverTriggerProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-progress" {
  interface ProgressProps extends React.ComponentProps {}
  interface ProgressIndicatorProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-scroll-area" {
  interface ScrollAreaProps extends React.ComponentProps {}
  interface ScrollAreaViewportProps extends React.ComponentProps {}
  interface ScrollAreaScrollbarProps extends React.ComponentProps {}
  interface ScrollAreaThumbProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-select" {
  interface SelectTriggerProps extends React.ComponentProps {}
  interface SelectIconProps extends React.ComponentProps {}
  interface SelectScrollUpButtonProps extends React.ComponentProps {}
  interface SelectScrollDownButtonProps extends React.ComponentProps {}
  interface SelectContentProps extends React.ComponentProps {}
  interface SelectViewportProps extends React.ComponentProps {}
  interface SelectLabelProps extends React.ComponentProps {}
  interface SelectItemProps extends React.ComponentProps {}
  interface SelectSeparatorProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-separator" {
  interface SeparatorProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-slider" {
  interface SliderProps extends React.ComponentProps {}
  interface SliderTrackProps extends React.ComponentProps {}
  interface SliderRangeProps extends React.ComponentProps {}
  interface SliderThumbProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-switch" {
  interface SwitchProps extends React.ComponentProps {}
  interface SwitchThumbProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-tabs" {
  interface TabsProps extends React.ComponentProps {}
  interface TabsListProps extends React.ComponentProps {}
  interface TabsTriggerProps extends React.ComponentProps {}
  interface TabsContentProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-toast" {
  interface ToastProps extends React.ComponentProps {}
  interface ToastViewportProps extends React.ComponentProps {}
  interface ToastActionProps extends React.ComponentProps {}
  interface ToastCloseProps extends React.ComponentProps {}
  interface ToastTitleProps extends React.ComponentProps {}
  interface ToastDescriptionProps extends React.ComponentProps {}
}

declare module "@radix-ui/react-toggle" {
  interface ToggleProps extends React.ComponentProps {}
}

declare module "vaul" {
  interface DrawerContentProps extends React.ComponentProps {}
}
