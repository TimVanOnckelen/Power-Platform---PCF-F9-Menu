import * as React from "react";
import {
  Menu,
  MenuTrigger,
  Button,
  MenuPopover,
  MenuItem,
  MenuList,
  FluentProvider,
  webLightTheme,
} from "@fluentui/react-components";

interface menuItem {
  label: string;
  name: string;
  disabled?: boolean;
}
export interface If9MenuProps {
  buttonLabel?: string;
  menuItems?: menuItem[];
}

export const f9Menu = (props: If9MenuProps) => {
  const { buttonLabel = "Menu", menuItems = [] } = props;
  return (
    <FluentProvider theme={webLightTheme}>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button>{buttonLabel}</Button>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            {menuItems.forEach((cMenuItem) => {
              return (
                <MenuItem disabled={cMenuItem.disabled}>
                  {cMenuItem.label}
                </MenuItem>
              );
            })}
          </MenuList>
        </MenuPopover>
      </Menu>
    </FluentProvider>
  );
};
