const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation")

const typeDefs = gql`
    extend type Query {
        orderById(id: ID): Order
    }

		type Order @key(fields: "id") {
        id: ID!
        orderNumber: String
        orderDate: String
        shippingDate: String
		}
`

const resolvers = {
	Order: {
		__resolveReference(object) {
      return products.find(product => product.upc === object.upc);
    }
	},
	Query: {
		orderById(_, args) {
			const x = orders.filter(order => order.id === args.id)
			return x[0]
		}
	}
}

const server = new ApolloServer({
	schema: buildFederatedSchema([
		{
			typeDefs,
			resolvers
		}
	])
});

server.listen({ port: 4005 }).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
})

const orders = [
	{
		id: "1",
		orderNumber: "987234",
		orderDate: "1-1-1990",
		shippingDate: "2-1-1990"
	}
]