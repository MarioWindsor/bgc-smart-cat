# bgc-website

## API Endpoints

### Login: (get access token)
```
https://bgc.sixorbit.com/?urlq=service&version=1.0&key=123&task=login&email=dev@bgc.com&password=1234&app_flag=2&network_ip=10.0.2.16
```

### Fetch Variations: (replace new access token)
```
https://bgc.sixorbit.com/?urlq=service&version=1.0&key=123&task=variation/fetch&user_id=410002480&access_token=5056529410151999108&last_updated&limit=&searchtext&limit_bit=0
```

### Fetch Category: (replace new access token)
```
http://bgc.sixorbit.com/?urlq=service&version=1.0&key=123&task=variation/fetch_category&user_id=410002480&access_token=5056529410151999108
```



```
Add Customer (User):

http://bgc.sixorbit.com/?urlq=service&version=4.0&key=123&task=customer/add_customer&user_id=410000275&access_token=6473009352540831748





Documentation:
https://documenter.getpostman.com/view/12511487/UVJbGd7o#07976844-39c8-4b02-b400-6e70cb290de1
```

## Mongo DB
u: mario
p: mongo3716

### compass
```
mongodb+srv://mario:mongo3716@bgc-cluster-01.p8sui.mongodb.net/
```


# To-do List

- Search Categories
- Category Listing
