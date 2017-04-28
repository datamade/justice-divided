### What's this?

We crunched numbers on juvenile arrests in Chicago by police district (2014) and demographic (2013-early 2017). Now they're yours.

### Requirements

- If you want to re-run the script that retrieves police district demographics, [census_area](https://github.com/datamade/census_area) (`pip install census_area`)
- [csvkit](https://github.com/wireservice/csvkit) (`pip install csvkit`)
- postgresql (`brew install postgresql`)

### Makin' data

Clone this repo and navigate to the `data/` dir in your terminal. From there you can [make the database](#Make-the-database), [refresh the provided data](#Remake-provided-data), or [both](#Remake-provided-data-and-make-the-database).

#### Make the database

```bash
make database
```

#### Remake provided data

Warning: Re-running the Census script will take about 20 minutes. 

If you must, first [get an API key](http://api.census.gov/data/key_signup.html) for the U.S. Census.

From the `data/` dir, run this command.

```bash
cp scripts/config.py.example scripts/config.py
```

Then add your Census API key to your freshly created `config.py`. 

Finally, run:

```bash
make clean
make output
```

### Remake provided data and make the database

```bash
make clean
make all
```

### contents

- a psql database, `jdiv`, with useful tables
- an `output/` dir with useful csv/geojson files