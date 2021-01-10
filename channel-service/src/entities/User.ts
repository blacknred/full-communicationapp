import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
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
  @Property({ type: "varchar", length: 20, nullable: false })
  phone!: string;

  @Field()
  @Property({ type: "varchar", length: 150 })
  password!: string;

  @Field()
  @Property({ type: "jsonb" })
  settings!: string;
}

// export async function get(id) {
//   const [row] = await db.query(
//     sql`
//       SELECT data
//       FROM my_data
//       WHERE id=${id}
//     `
//   );
//   return row ? row.data : null;
// }

// export async function set(id, value) {
//   await db.query(sql`
//     INSERT INTO my_data (id, data)
//     VALUES (${id}, ${value})
//     ON CONFLICT id
//     DO UPDATE SET data = EXCLUDED.data;
//   `);
// }

// export async function listByAuthor(author) {
//   return await db.query(
//     sql`
//       SELECT data
//       FROM my_data
//       WHERE
//         data ->> 'author'
//           = ${author}
//     `
//   );
// }
