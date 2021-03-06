import User from "../../../../entities/User";
import { ChangeProfileMutationArgs, ChangeProfileResponse } from "../../../../types/graph";
import privateResolver from "../../../../utils/privateResolver";

const resolvers = {
  Mutation: {
    ChangeProfile: privateResolver(
      async (_: any, args: ChangeProfileMutationArgs, ctx: any): Promise<ChangeProfileResponse> => {
        const userId: number = ctx.userId;
        const { bio, avatar } = args;

        try {
          const user = await User.findOne({ id: userId });

          if (user) {
            if (bio) {
              user.bio = bio;
            }
            if (avatar) {
              user.avatar = avatar;
            }

            await user.save();

            const userToString = {
              ...user,
              createdAt: user.createdAt.toString(),
              updatedAt: user.updatedAt.toString()
            };

            return {
              error: null,
              ok: true,
              user: userToString
            };
          } else {
            return {
              error: "User not found",
              ok: false,
              user: null
            };
          }
        } catch (e) {
          return {
            error: e.message,
            ok: false,
            user: null
          };
        }
      }
    )
  }
};

export default resolvers;
