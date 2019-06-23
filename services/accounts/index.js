const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    me: User
    test(id: ID): User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
    shippingAddress: Address
  }

  type Address {
    id: String!
    addressLine1: String
    addressLine2: String
    suburb: String
    postCode: String
    state: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    },
    test(_, input) {
      const x = users.filter(user => user.id === input.id)
      return x[0]
    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Christopher Wade",
    birthDate: "10/05/1990",
    username: "@christopherxc",
    shippingAddress: {
      id: "123",
      addressLine1: "15 Lasseter street",
      addressLine2:  "",
      suburb: "Kedron",
      postCode: "4031",
      state: "QLD"
    }
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];
