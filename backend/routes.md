# Routes

Get cats owned by user by their user_id

```text
➜  cat-tales git:(main) ✗ curl -X GET http://localhost:8000/api/player/getPlayerCat/830de087-a3cf-4c44-ba70-e7d34e141203 | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   109  100   109    0     0   4556      0 --:--:-- --:--:-- --:--:--  4739
[
  {
    "id": 1,
    "name": "Chairo",
    "rarity": 2,
    "level": 2,
    "charm": null,
    "user_id": "830de087-a3cf-4c44-ba70-e7d34e141203"
  }
]
```

Get player by their username

```text
➜  cat-tales git:(main) ✗ curl -X GET http://localhost:8000/api/player/getPlayer/ooga | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    65  100    65    0     0   1574      0 --:--:-- --:--:-- --:--:--  1585
{
  "username": "ooga",
  "user_id": "830de087-a3cf-4c44-ba70-e7d34e141203"
}
```

Drop a random cat

```text
➜  cat-tales git:(main) ✗ curl -X GET http://localhost:8000/api/cat/dropRandom | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    49  100    49    0     0  11507      0 --:--:-- --:--:-- --:--:-- 16333
{
  "type": {
    "typeId": 2,
    "type": "Uncommon"
  },
  "level": 2
}
```

Adopt the cat

```text
➜  cat-tales git:(main) ✗ curl -X POST http://localhost:8000/api/cat/adopt -d '{"name": "Chairo", "type": 2, "level": 2, "user_id": "830de087-a3cf-4c44-ba70-e7d34e141203"}' -H 'Content-Type: application/json'  | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   130  100    38  100    92   1225   2968 --:--:-- --:--:-- --:--:--  4333
{
  "message": "Cat adopted successfully"
}
```

Drop a random item

```text
➜  cat-tales git:(main) ✗ curl -X GET http://localhost:8000/api/item/dropRandom | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   125  100   125    0     0  17057      0 --:--:-- --:--:-- --:--:-- 20833
{
  "type": {
    "name": "Sparkling Crystal Pendant",
    "type": "Charm",
    "type_id": 3
  },
  "rarity": {
    "item_rarity_id": 1,
    "item_rarity": "Common"
  }
}
```

Add dropped item to inventory

```text
➜  cat-tales git:(main) ✗ curl -X POST http://localhost:8000/api/item/add -d '{"name": "Sparkling Crystal Pendant", "type": 3, "rarity": 1, "user_id": "830de087-a3cf-4c44-ba70-e7d34e141203"}' -H 'Content-Type: application/json' | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   150  100    38  100   112    488   1439 --:--:-- --:--:-- --:--:--  1948
{
  "message": "Item stored in inventory"
}
```

Register a user

```text
➜  cat-tales git:(main) ✗ curl -X POST http://localhost:8000/api/auth/signup -d '{"username": "ooga", "email": "testuser@gmail.com", "password": "passwd"}' -H 'Content-Type: application/json' | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   212  100   139  100    73    863    453 --:--:-- --:--:-- --:--:--  1325
{
  "authStatus": "user registered",
  "message": {
    "username": "ooga",
    "email": "testuser@gmail.com",
    "userId": "830de087-a3cf-4c44-ba70-e7d34e141203"
  }
}
```

Login

```text
➜  cat-tales git:(main) ✗ curl -X POST http://localhost:8000/api/auth/login -d '{"username": "ooga", "password": "passwd"}' -H 'Content-Type: application/json' | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   176  100   134  100    42   2138    670 --:--:-- --:--:-- --:--:--  2838
{
  "authStatus": "authorized",
  "message": {
    "username": "ooga",
    "email": "testuser@gmail.com",
    "userId": "830de087-a3cf-4c44-ba70-e7d34e141203"
  }
}
```

Display items in store

```text
➜  cat-tales git:(main) ✗ curl -X GET http://localhost:8000/api/store/getItems | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3640  100  3640    0     0   235k      0 --:--:-- --:--:-- --:--:--  253k
{
  "itemNames": [
    {
      "name": "Tasty Tuna Treats",
      "type": "Food",
      "type_id": 1,
      "rarity": "Epic",
      "rarity_id": 4,
      "price": 40
    },
    {
      "name": "Crunchy Chicken Bites",
      "type": "Food",
      "type_id": 1,
      "rarity": "Rare",
      "rarity_id": 3,
      "price": 35
    },
    {
      "name": "Savory Salmon Delight",
      "type": "Food",
      "type_id": 1,
      "rarity": "Rare",
      "rarity_id": 3,
      "price": 32
    },
    ...
  ]
}
```

Buy store items

```text
➜  cat-tales git:(main) ✗ curl -X POST http://localhost:8000/api/store/buyItem -d '{"name": "Gentle Ear Cleaner", "type": 7, "rarity": 2, "price": 35, "user_id": "830de087-a3cf-4c44-ba70-e7d34e141203"}' -H 'Content-Type: application/json' | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   156  100    38  100   118    284    883 --:--:-- --:--:-- --:--:--  1172
{
  "message": "Item bought successfully"
}
```
