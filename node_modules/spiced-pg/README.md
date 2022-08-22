# Spiced PG

## Usage

```js
var spicedPg = require('spiced-pg');

var db = spicedPg('postgres:spicedling:password@localhost:5432/cities');

db.query('SELECT * FROM cities').then(function(results) {
    console.log(results.rows);
}).catch(function(err) {
    console.log(err);
});
```
