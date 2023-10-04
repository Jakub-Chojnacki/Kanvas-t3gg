import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import image from "./hero-bullets.svg";

export function HeroBullets() {
  return (
    <Container size="md">
      <div className=" flex justify-between pb-32 pt-32">
        <div className="mr-24 max-w-lg lg:mr-0 lg:max-w-[100%] ">
          <Title className="font-black sm:text-2xl md:text-4xl">
            A{" "}
            <span className="relative border-r-2 bg-logoPurple-100 px-3 py-1">
              modern
            </span>{" "}
            way
            <br /> to manage your work
          </Title>
          <Text c="dimmed" mt="md">
            A modern way to manage your work - Say hello to efficiency,
            simplicity, and teamwork. Organize tasks with ease, collaborate
            seamlessly, and promote teamwork. Experience the future of work
            management today.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl" className="bg-logoPurple-100">
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Simplicity Redefined</b> - Our Kanban board app is designed
              with simplicity in mind. Say goodbye to complex interfaces and
              overwhelming features.
            </List.Item>
            <List.Item>
              <b>Designed for smaller teams</b> - Our intuitive design allows
              small teams to get started instantly, making task management a
              breeze.
            </List.Item>
            <List.Item>
              <b>Free to get started</b> - All of our main features are free so
              you can get a taste of kanvas workflow and decide if it suits your
              team.
            </List.Item>
          </List>

          <Group mt={30}>
            <Button
              radius="xl"
              size="md"
              className="bg-logoPurple-100 hover:bg-logoPurple-200 sm:flex-1"
            >
              Get started
            </Button>
          </Group>
        </div>
        <Image src={image.src} className="image" />
      </div>
    </Container>
  );
}
