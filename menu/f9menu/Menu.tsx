/* eslint-disable react/no-children-prop */
import * as React from 'react';
import { Menu, MenuTrigger, Button, MenuPopover, MenuItem, Text, MenuList, FluentProvider, webLightTheme } from '@fluentui/react-components';
import { type FluentIcon, AccessTime20Filled } from '@fluentui/react-icons';

interface IMenuItem {
  label: string;
  name: string;
  disabled?: boolean;
  items?: IMenuItem[];
  secondary?: string;
  icon?: string;
}

export interface IF9MainMenu {
  buttonLabel?: string;
  children: React.ReactElement<any, any>;
  isButton?: boolean;
  icon?: string;
}

export interface If9MenuProps {
  buttonLabel?: string;
  items?: string | null;
}

export interface IF9SubMenuProps {
  items: IMenuItem[];
  setLastTriggerd: (name: string) => void;
  isMain: boolean;
}

export interface IF9MenuItem {
  setLastTriggerd: (name: string) => void;
  child: IMenuItem;
}

export interface IF9IconProps {
  iconName: string;
}

const F9Menu = (properties: IF9MainMenu) => {
  const { isButton = true } = properties;
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        {isButton === true ? (
          <Button>{properties.buttonLabel}</Button>
        ) : (
          <MenuItem icon={<F9RenderIcon iconName={properties.icon!} />}>{properties.buttonLabel}</MenuItem>
        )}
      </MenuTrigger>
      <MenuPopover> {properties.children}</MenuPopover>
    </Menu>
  );
};

const F9SubMenu = (properties: IF9SubMenuProps) => {
  return (
    <MenuList>
      {properties.items.map((child) => {
        if (child.items) {
          return (
            <F9Menu
              key={child.name}
              buttonLabel={child.name}
              isButton={false}
              icon={child.icon}
            >
              <F9SubMenu
                items={child.items}
                setLastTriggerd={properties.setLastTriggerd}
                isMain={false}
              />
            </F9Menu>
          );
        } else {
          return (
            <F9MenuItem
              child={child}
              setLastTriggerd={properties.setLastTriggerd}
              key={child.name}
            />
          );
        }
      })}
    </MenuList>
  );
};

const RenderIcon = (properties: IF9IconProps) => {
  const { iconName } = properties;

  try {
    const Component = React.lazy(() =>
      import('@fluentui/react-icons')
        .then((x) => ({
          // @ts-ignore
          default: x[`${iconName}`],
        }))
        .catch(() => ({
          default: '',
        }))
    );
    return <Component />;
  } catch (e) {
    console.log(e);
    return <AccessTime20Filled />;
  }
};

const F9RenderIcon = (properties: IF9IconProps) => {
  const { iconName } = properties;
  const name = iconName as keyof FluentIcon;

  if (iconName) {
    return <RenderIcon iconName={iconName} />;
  }
  return <></>;
};

const F9MenuItem = (properties: IF9MenuItem) => {
  const { child } = properties;

  return (
    <MenuItem
      onClick={() => properties.setLastTriggerd(child.name)}
      secondaryContent={child.secondary!}
      key={child.name}
      icon={<F9RenderIcon iconName={child.icon!} />}
    >
      {child.label}
    </MenuItem>
  );
};

export const Loading = () => {
  return <Text>Loading...</Text>;
};

export const f9Menu = (props: If9MenuProps) => {
  const { buttonLabel = 'Menu', items = '' } = props;

  const [getItems, setItems] = React.useState<IMenuItem[]>([]);

  const [getLastTriggerd, setLastTriggerd] = React.useState<string>('');

  React.useEffect(() => {
    try {
      const parsedItems = JSON.parse('{"items":[' + props.items + ']}');
      setItems(parsedItems.items!);
    } catch {
      setItems([]);
    }
  }, [items]);

  React.useEffect(() => {}, [getLastTriggerd]);

  return (
    <React.Suspense fallback={<Loading />}>
      <FluentProvider theme={webLightTheme}>
        <F9Menu buttonLabel={buttonLabel}>
          <F9SubMenu
            items={getItems}
            setLastTriggerd={setLastTriggerd}
            isMain={true}
          ></F9SubMenu>
        </F9Menu>
      </FluentProvider>
    </React.Suspense>
  );
};
