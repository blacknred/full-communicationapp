import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Thread {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: "varchar", length: 80, unique: true, nullable: false })
  name!: string;

  @Field()
  @Property({ type: "varchar", length: 150 })
  fullname!: string;

  @Field()
  @Property({ type: "varchar", length: 300 })
  description!: string;

  @Field()
  @Property({ type: "text", nullable: false })
  avatar!: string;

  @Field()
  @Property({ type: "text", unique: true })
  email!: string;

  @Field()
  @Property({ type: "varchar", length: 20 })
  phone!: string;

  @Field()
  @Property({ type: "jsonb" })
  settings!: string;
}