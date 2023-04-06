const { User } = require("../mongoose-schemas/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const { UserInputError } = require("apollo-server");

const pubSub = new PubSub();

async function publishUsersCount() {
  const usersCount = await User.count();
  pubSub.publish("users_count", { usersCount });
}
publishUsersCount();

module.exports.resolvers = {
  Query: {
    usersCount: async () => {
      const count = await User.count();
      return count;
    },
  },
  Mutation: {
    registerUser: async (_, args) => {
      const { userName, email, password } = args;
      try {
        const existedUser = await User.findOne({ email });
        if (!!existedUser) {
          const error = new Error("user_already_exists");
          error.code = 409;
          throw error;
        }
        const hashed = await bcrypt.hash(password, 12);
        const newUser = new User({
          userName,
          email,
          loginCount: 0,
          password: hashed,
        });
        await newUser.save();
        publishUsersCount();
        return { email, userName };
      } catch (err) {
        throw new UserInputError(err);
      }
    },
    login: async (_, args) => {
      const { email, password } = args;
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error("wrong_email_or_password");
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          throw new Error("wrong_email_or_password");
        }
        user.loginCount++;
        await user.save();
        const accessToken = jwt.sign(
          { userId: user.id },
          process.env.ACCESS_TOKEN_SECRET_KEY,
          { expiresIn: "1m" }
        );
        const refreshToken = jwt.sign(
          { userId: user.id },
          process.env.REFRESH_TOKEN_SECRET_KEY,
          { expiresIn: "10m" }
        );
        return {
          accessToken,
          refreshToken,
          loginCount: user.loginCount,
          // exp,
        };
      } catch (err) {
        throw new UserInputError(err);
      }
    },
  },
  Subscription: {
    usersCount: {
      subscribe: async () => {
        const response = await pubSub.asyncIterator("users_count");
        console.log("response", response);
        return response;
      },
    },
  },
};
