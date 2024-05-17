/* eslint-disable react/no-children-prop */
import * as React from 'react';
import {
  Menu,
  MenuTrigger,
  Button,
  MenuPopover,
  MenuItem,
  Text,
  MenuList,
  FluentProvider,
  webLightTheme,
  type Theme,
  teamsDarkTheme,
  teamsLightTheme,
  teamsHighContrastTheme,
  webDarkTheme,
} from '@fluentui/react-components';
import { type FluentIcon } from '@fluentui/react-icons';

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
  onMenuChange: () => void;
  lastClickedMenuItem: (item: string) => void;
  fluentUiTheme?: string;
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

export interface IErrorBoundry {
  children: React.ReactElement<any, any>;
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
        .catch(() => {
          throw new Error('Error rendering menu item');
        })
    );
    return <Component />;
  } catch {
    throw new Error('Error rendering menu item');
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

function ErrorBoundary(props: IErrorBoundry) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return <>Error in menu, please check if your item data is valid.</>;
  }

  return props.children;
}

export const f9Menu = (props: If9MenuProps) => {
  const { buttonLabel = 'Menu', items = '', lastClickedMenuItem, onMenuChange, fluentUiTheme = 'webLightTheme' } = props;

  const [getItems, setItems] = React.useState<IMenuItem[]>([]);
  const [currentTheme, setCurrentTheme] = React.useState<Theme | React.LazyExoticComponent<any>>(webLightTheme);

  const [getLastTriggerd, setLastTriggerd] = React.useState<string>('');

  React.useEffect(() => {
    switch (fluentUiTheme) {
      case 'webLightTheme':
        setCurrentTheme(webLightTheme);
        break;
      case 'webDarkTheme':
        setCurrentTheme(webDarkTheme);
        break;
      case 'teamsDarkTheme':
        setCurrentTheme(teamsDarkTheme);
        break;
      case 'teamsLightTheme':
        setCurrentTheme(teamsLightTheme);
        break;
      case 'teamsHighContrast':
        setCurrentTheme(teamsHighContrastTheme);
        break;
    }
  }, [fluentUiTheme]);

  React.useEffect(() => {
    try {
      const parsedItems = JSON.parse('{"items":[' + props.items + ']}');
      setItems(parsedItems.items!);
    } catch {
      setItems([]);
    }
  }, [items]);

  React.useEffect(() => {
    lastClickedMenuItem(getLastTriggerd);
    onMenuChange();
  }, [getLastTriggerd]);

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<Loading />}>
        <FluentProvider theme={currentTheme as Theme}>
          <F9Menu buttonLabel={buttonLabel}>
            <F9SubMenu
              items={getItems}
              setLastTriggerd={setLastTriggerd}
              isMain={true}
            ></F9SubMenu>
          </F9Menu>
        </FluentProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
};
