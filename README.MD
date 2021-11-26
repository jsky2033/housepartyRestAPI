# Database Structure


# Reason for double check on 

Note the reason for having the comparison check of the user id in the URL and in the request body is for security.

The backend server will reject any requests sent to it to perform an operation on a user that does not have that user's id in the request body. 

Of course this can be bypassed by someone who has the user's uid and then uses that in the request body but that is a problem to solve in the future. 

# Users

This will contain basic user data. However it will also contain the authID of the user. This is the ID provided by Firebase. 

## Posts and Houses

The posts and houses will be their own collection. This is because because we often will not need to retrieve the houses or posts for a user and can simply get the user data instead.

There are specific pages which will need to have house/post data and it is cleaner and more efficient to simply get them when it is needed. 

# Deployment

Automatic deployment of the rest api application through heroku is now guranteed.

# Important notes

1. When using routes, the '/:id' ensures that everything after / is treated like the id. As such, if /:id is used along routes, it is best to have something like '/userOps/getAll' so that confusion is avoided with the id. See the users route for an example.