/* eslint-disable react/no-children-prop */
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

interface IMenuItem {
  label: string;
  name: string;
  disabled?: boolean;
  children?: IMenuItem[];
  secondary?: string;
}
export interface If9MenuProps {
  buttonLabel?: string;
  menuItems?: string | null;
}

export interface IF9SubMenuProps {
  label: string;
  children: IMenuItem[];
  setLastTriggerd: (name: string) => void;
}

const F9SubMenu = (properties: IF9SubMenuProps) => {
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <MenuItem>{properties.label}</MenuItem>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {properties.children.map((child) => {
            if (child.children) {
              return (
                <F9SubMenu
                  label={child.name}
                  children={child.children}
                  setLastTriggerd={properties.setLastTriggerd}
                  key={child.name}
                />
              );
            } else {
              return (
                <MenuItem
                  onClick={() => properties.setLastTriggerd(child.name)}
                  secondaryContent={child.secondary!}
                  key={child.name}
                >
                  {child.label}
                </MenuItem>
              );
            }
          })}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export const f9Menu = (props: If9MenuProps) => {
  const { buttonLabel = "Menu", menuItems = "" } = props;

  const [getItems, setItems] = React.useState<IMenuItem[]>([]);

  const [getLastTriggerd, setLastTriggerd] = React.useState<string>("");

  React.useEffect(() => {
    const parsedItems = JSON.parse('{"items":[' + props.menuItems + "]}");
    setItems(parsedItems.items!);
  }, [menuItems]);

  React.useEffect(() => {}, [getLastTriggerd]);

  return (
    <FluentProvider theme={webLightTheme}>
      <F9SubMenu
        label={buttonLabel}
        children={getItems}
        setLastTriggerd={setLastTriggerd}
      ></F9SubMenu>
    </FluentProvider>
  );
};
