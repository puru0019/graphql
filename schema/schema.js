const graphql = require("graphql");
const axios = require("axios");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema
} = graphql;

const users = [
{id:'23',firstName:'Gopi',age:22},
{id:'22',firstName:'Nandu',age:20}
];

const CompanyType = new GraphQLObjectType({
	name:'Company',
	fields: {
		id: {type:GraphQLString},
		companyName: {type:GraphQLString},
		description: {type:GraphQLString}
	}
});

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: {type:GraphQLString},
		age: {type:GraphQLInt},
		firstName: {type:GraphQLString},
		company: {
			type:CompanyType,
			resolve(parentValue,args) {
				return axios.get(`http://localhost:3000/company/${parentValue.companyId}`)
						.then(res => res.data);
			}
		}
	}
});

const RootQuery = new GraphQLObjectType({
	name:'RootQueryType',
	fields: {
		User: {
			type:UserType,
			args: {
				id:{type:GraphQLString}
			},
			resolve(parentValue,args) {
				return axios.get(`http://localhost:3000/users/${args.id}`)
						.then(res=>res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query:RootQuery
});