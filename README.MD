# Database Structure

# Reason for double check on 

Note the reason for having the comparison check of the user id in the URL and in the request body is for security.

The backend server will reject any requests sent to it to perform an operation on a user that does not have that user's id in the request body. 

Of course this can be bypassed by someone who has the user's uid and then uses that in the request body but that is a problem to solve in the future. 

# Users

This will contain basic user data. However it will also contain the authID of the user. This is the ID provided by Firebase. 

However adding other users to the house, this will be handled by the user's database ID rather than their authId. This is to protect the authId from visiblity to users other than the user who the authId belongs to. 

## Posts and Houses

The posts and houses will be their own collection. This is because because we often will not need to retrieve the houses or posts for a user and can simply get the user data instead.

There are specific pages which will need to have house/post data and it is cleaner and more efficient to simply get them when it is needed. 

# House Mates

The reason that the housemates finder function sends back all the data for the users is because it would be highly inefficient for the frontend to get the data itself for every user.

As such the 'in' function in mongoose that essentially gets all the documents with certain ids from another collection. Similar to the JOIN operation in SQL databases.

# Deployment

Automatic deployment of the rest api application through heroku is now guranteed.

# Important notes

1. When using routes, the '/:id' ensures that everything after / is treated like the id. As such, if /:id is used along routes, it is best to have something like '/userOps/getAll' so that confusion is avoided with the id. See the users route for an example.
2. We are making the assumption in the 'find by geocode' api that no two houses will have the same address which is a reasonable assumption given the scale of our application. 
3. There really is no reason to map out the returned lists from MongoDB. As shown by the get all geocodes function, it is fully possible to omit fields using mongoose itself. 