import * as argon2 from 'argon2';
import { Resolver, Mutation, Arg, Ctx, InputType, Field, ObjectType } from "type-graphql";
import { User } from "../entities/User";
import { AppCtx } from "src/types";

@InputType()
class UserInput {
  @Field()
  name!: string;

  @Field()
  avatar?: string;

  @Field()
  phone?: string;

  @Field()
  fullname?: string;
  
  @Field()
  email?: string;

  @Field()
  password?: string;
}

@ObjectType()
class FieldError {
  @Field()
  field!: string;

  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options") options: UserInput,
    @Ctx() ctx: AppCtx
  ): Promise<UserResponse> {
    if (options.name.length <= 2) {
      return {
        errors: [{
          field: "name",
          message: ""
        }]
      }
    }

    // const hashedPassword = await argon2.hash(options.password);
    const user = ctx.em.create(User, options);
    await ctx.em.persistAndFlush(user);

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UserInput,
    @Ctx() ctx: AppCtx
  ): Promise<UserResponse> {
    const user = await ctx.em.findOneOrFail(User, options);
    if (!user) {
      return {
        errors: [{
          field: 'name',
          message: "length must be greater than 2"
        }]
      }
    }

    const valid = await argon2.verify(user.password || '', options.password || '');
    if (!valid) {
      return {
        errors: [{
          field: 'password',
          message: "incorrect password"
        }]
      }
    }

    return {};
  }
}


// login(options: { username: "ben", password: 'ben }) {
//   errors {
//     field
//     message
//   }
//   user {
//     id
//     name
//   }
// } 
