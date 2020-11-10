import 'reflect-metadata'
import { MikroORM} from "@mikro-orm/core"
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config'

import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

const main = async () => {
  const orm = await MikroORM.init(microConfig)
  await orm.getMigrator().up()

  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false
    }),
    context: () => ({em: orm.em})
  })

  apolloServer.applyMiddleware({app})

  // app.get('/', (_, res) => {
  //   res.send("Hello World")
  // })

  app.listen(9000, () => {
    console.log('Server started on localhost:9000')
  })

  // const post = orm.em.create(Post, {title: 'My first post'})
  // await orm.em.persistAndFlush(post)

}

main().catch(error => console.error(error))