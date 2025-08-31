import { query , mutation } from "./_generated/server.js";

export const getMany = query({
    args : {},
    handler : async (ctx) => {
        const users = await ctx.db.query("users").collect();
        return users;
    }
})

export const add = mutation({
    args : {},
    handler : async(ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        console.log(identity);
        if( identity === null ) {
            throw new Error('Not Authenticated!')
        }       

        const orgId = identity.orgId as string;
        
        if(!orgId) {
            throw new Error('Missing Organizations')
        }
        const userID = await ctx.db.insert("users" , {
            name : "antonio",
        });

        return userID;
    }
})