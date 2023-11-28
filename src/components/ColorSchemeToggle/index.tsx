import { ActionIcon, Group, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

const ColorSchemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group position="center" >
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[0],
          color:
            theme.colorScheme === "dark"
              ? theme.colors.yellow[4]
              : theme.colors.blue[6],
          border: '1px solid',
          borderColor: theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[3]

        })}
      >
        {colorScheme === "dark" ? (
          <IconSun size={18} stroke={1.5} />
        ) : (
          <IconMoonStars size={18} stroke={1.5} />
        )}
      </ActionIcon>
    </Group>
  );
};

export default ColorSchemeToggle;
