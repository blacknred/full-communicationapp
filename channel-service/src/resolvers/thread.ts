import { Thread } from "../entities/Thread";
import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { AppCtx } from "src/types";

@Resolver()
export class ThreadResolver {
  @Query(() => [Thread])
  async getThreads(@Ctx() ctx: AppCtx): Promise<Thread[]> {
    return ctx.em.find(Thread, {});
  }

  @Query(() => Thread, { nullable: true })
  async getThread(
    @Arg("id") id: number,
    @Ctx() ctx: AppCtx
  ): Promise<Thread | null> {
    return ctx.em.findOne(Thread, { id });
  }

  @Mutation(() => Thread)
  async createThread(
    @Arg("name") name: string,
    @Arg("avatar") avatar: string,
    @Arg("phone") phone: string,
    @Arg("fullname") fullname: string,
    @Arg("email") email: string,
    @Ctx() ctx: AppCtx
  ): Promise<Thread> {
    const thread = ctx.em.create(Thread, {
      name,
      avatar,
      phone,
      fullname,
      email,
    });
    await ctx.em.persistAndFlush(thread);
    return thread;
  }

  @Mutation(() => Thread, { nullable: true })
  async updateThread(
    @Arg("id") id: number,
    @Arg("name") name: string,
    @Arg("avatar") avatar: string,
    @Arg("phone") phone: string,
    @Arg("fullname") fullname: string,
    @Arg("email") email: string,
    @Ctx() ctx: AppCtx
  ): Promise<Thread | null> {
    const thread = await ctx.em.findOne(Thread, { id });
    if (!thread) return null;

    const updatedThread = { ...thread, name, avatar, phone, fullname, email };
    await ctx.em.persistAndFlush(updatedThread);
    return updatedThread;
  }

  @Mutation(() => Boolean)
  async deleteThread(
    @Arg("id") id: number,
    @Ctx() ctx: AppCtx
  ): Promise<boolean> {
    await ctx.em.nativeDelete(Thread, { id });
    return true;
  }
}
