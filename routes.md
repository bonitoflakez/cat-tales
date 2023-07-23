# Routes

Get cats owned by user by their ID

```text
➜  cat-tales git:(main) ✗ curl -X GET http://localhost:8000/api/player/getPlayerCat/1 | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    72  100    72    0     0  12574      0 --:--:-- --:--:-- --:--:-- 14400
[
  {
    "id": 1,
    "name": "chairo",
    "rarity": 2,
    "level": 3,
    "charm": null,
    "ownerid": 1
  }
]
```

Get player by their ID

```text
➜  cat-tales git:(main) ✗ curl -X GET http://localhost:8000/api/player/getPlayer/1 | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    28  100    28    0     0   1359      0 --:--:-- --:--:-- --:--:--  1400
{
  "id": 1,
  "username": "bonito"
}
```

Drop a random cat

```text
➜  cat-tales git:(main) ✗ curl -X GET http://localhost:8000/api/cat/dropRandom | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    49  100    49    0     0  14776      0 --:--:-- --:--:-- --:--:-- 24500
{
  "type": {
    "typeId": 2,
    "type": "Uncommon"
  },
  "level": 8
}
```

Adopt the cat

```text
➜  cat-tales git:(main) ✗ curl -X POST http://localhost:8000/api/cat/adopt -d '{"name": "Yuki", "type": 2, "level": 8, "ownerId": 1}' -H 'Content-Type: application/json'  | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    91  100    38  100    53    734   1024 --:--:-- --:--:-- --:--:--  1784
{
  "message": "Cat adopted successfully"
}
```

Drop a random item

```text
➜  cat-tales git:(main) ✗ curl -X GET http://localhost:8000/api/item/dropRandom | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   119  100   119    0     0  34512      0 --:--:-- --:--:-- --:--:-- 39666
{
  "type": {
    "name": "Yummy Yogurt Drops",
    "type": "Food",
    "type_id": 1
  },
  "rarity": {
    "item_rarity_id": 2,
    "item_rarity": "Uncommon"
  }
}
```

Add dropped item to inventory

```text
➜  cat-tales git:(main) ✗ curl -X POST http://localhost:8000/api/item/add -d '{"name": "Yummy Yogurt Drops", "type": 1, "rarity": 2, "ownerI
d": 1}' -H 'Content-Type: application/json' | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   106  100    38  100    68   1637   2930 --:--:-- --:--:-- --:--:--  4818
{
  "message": "Item stored in inventory"
}
```

Register a user

```text
➜  cat-tales git:(main) ✗ curl -X POST http://localhost:8000/api/auth/signup -d '{"username": "testuser", "email": "testuser@gmail.com", "pa
ssword": "passwd"}' -H 'Content-Type: application/json' | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   248  100   171  100    77   1450    653 --:--:-- --:--:-- --:--:--  2119
{
  "authStatus": "user registered",
  "message": {
    "username": "testuser",
    "email": "testuser@gmail.com",
    "hashedPass": "$2b$10$sG4le1WRyUE0Rc8enyRIeuJhz/iRCqsPYZrocOpda4CoFg00euZ/."
  }
}
```

Login

```text
➜  cat-tales git:(main) ✗ curl -X POST http://localhost:8000/api/auth/login -d '{"username": "testuser", "password": "passwd"}' -H 'Content-
Type: application/json' | json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   212  100   166  100    46   2224    616 --:--:-- --:--:-- --:--:--  2864
{
  "authStatus": "authorized",
  "message": {
    "username": "testuser",
    "email": "testuser@gmail.com",
    "hashedPass": "$2b$10$sG4le1WRyUE0Rc8enyRIeuJhz/iRCqsPYZrocOpda4CoFg00euZ/."
  }
}
```
