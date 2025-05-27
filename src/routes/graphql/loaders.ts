import type { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';

export const createLoaders = (prisma: PrismaClient) => ({
  profileLoader: new DataLoader<string, Profile | undefined>(async (keys) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: [...keys] } },
    });
    return keys.map((key) => profiles.find((profile) => profile.userId === key));
  }),
  postLoader: new DataLoader<string, Post[]>(async (keys) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: [...keys] } },
    });
    return keys.map((key) => posts.filter((post) => post.authorId === key));
  }),
  userSubscribedToLoader: new DataLoader<string, User[]>(async (keys) => {
    const authors = await prisma.user.findMany({
      include: { subscribedToUser: true },
      where: { subscribedToUser: { some: { subscriberId: { in: [...keys] } } } },
    });
    return keys.map((key) =>
      authors.filter((author) =>
        author.subscribedToUser.some((user) => user.subscriberId === key),
      ),
    );
  }),
  subscribedToUserLoader: new DataLoader<string, User[]>(async (keys) => {
    const subscribers = await prisma.user.findMany({
      include: { userSubscribedTo: true },
      where: { userSubscribedTo: { some: { authorId: { in: [...keys] } } } },
    });
    return keys.map((key) =>
      subscribers.filter((sbs) =>
        sbs.userSubscribedTo.some((user) => user.authorId === key),
      ),
    );
  }),
  memberLoader: new DataLoader<string, MemberType | undefined>(async (keys) => {
    const members = await prisma.memberType.findMany({
      where: { id: { in: [...keys] } },
    });
    return keys.map((key) => members.find((member) => member.id === key));
  }),
});
