const graphql = require("graphql");
const axios = require("axios");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql;

const users = [
{id:'23',firstName:'Gopi',age:22},
{id:'22',firstName:'Nandu',age:20}
];

const CompanyType = new GraphQLObjectType({
	name:'Company',
	fields: ()=>({
		id: {type:GraphQLString},
		companyName: {type:GraphQLString},
		description: {type:GraphQLString},
		users: {
			type: new GraphQLList(UserType),
			resolve(parentValue,args) {
				return axios.get(`http://localhost:3000/company/${parentValue.id}/users`)
						.then(res => res.data)
			}
		}
	})
});

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
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
	})
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
		},
		company: {
			type: CompanyType,
			args: {
				id: {type: GraphQLString}
			},
			resolve(parentValue,args) {
				return axios.get(`http://localhost:3000/company/${args.id}`)
						.then(res=>res.data);
			}
		}
	}
});

const mutation =  new GraphQLObjectType({
	name:'Mutation',
	fields: {
		addUser: {
			type:UserType,
			args: {
				firstName: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)},
				companyId: {type: GraphQLString}
			},
			resolve(parentValue,{firstName, age}){
				return axios.post('http://localhost:3000/users',{firstName,age})
						.then(res=>res.data)
			}
		},
		deleteUser: {
			type: UserType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve(parentValue,{id}) {
				return axios.delete(`http://localhost:3000/users/${id}`)
						.then(res=>res.data);
			}
		},
		editUser: {
			type: UserType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLString)},
				firstName: {type: GraphQLString},
				age: {type: GraphQLInt},
				companyId: {type: GraphQLString}
			},
			resolve(parentValue,args) {
				return axios.patch(`http://localhost:3000/users/${args.id}`,args)
						.then(res=>res.data);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query:RootQuery,
	mutation
});