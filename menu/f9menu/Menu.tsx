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
            return (
              <MenuItem onClick={() => properties.setLastTriggerd(child.name)}>
                {child.label}
              </MenuItem>
            );
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

  return (
    <FluentProvider theme={webLightTheme}>
      {getLastTriggerd}
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button>{buttonLabel}</Button>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            {getItems.map((cMenuItem) => {
              if (cMenuItem.children) {
                return (
                  <F9SubMenu
                    label={cMenuItem.name}
                    children={cMenuItem.children}
                    setLastTriggerd={setLastTriggerd}
                  />
                );
              } else {
                return (
                  <MenuItem onClick={() => setLastTriggerd(cMenuItem.name)}>
                    {cMenuItem.label}
                  </MenuItem>
                );
              }
            })}
          </MenuList>
        </MenuPopover>
      </Menu>
    </FluentProvider>
  );
};
