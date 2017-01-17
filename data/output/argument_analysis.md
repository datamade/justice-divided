

## 1. a. Youth in majority-black neighborhoods are arrested at a disproportionately high rate.

### i. Seven of the nine majority-black police districts are among 10 where most arrests occur. 


~~~~{.python}
exec_psql("""
    SELECT
      met.dist_num, 
      dist_name, 
      pct_black, 
      total_pop, 
      num_arrests, 
      RANK() OVER(ORDER BY num_arrests DESC) AS arrest_rank 
    FROM police_district_metadata AS met 
    JOIN arrests_by_district AS arr
      ON met.dist_num = arr.dist_num""")
~~~~~~~~~~~~~

```
 dist_num |   dist_name    | pct_black | total_pop | num_arrests | arrest_rank 
----------+----------------+-----------+-----------+-------------+-------------
       11 | Harrison       |     84.05 |     76270 |        1765 |           1
        8 | Chicago Lawn   |     20.68 |    256572 |        1598 |           2
       15 | Austin         |     93.06 |     61418 |        1348 |           3
        4 | South Chicago  |     61.17 |    121844 |        1334 |           4
       10 | Ogden          |     32.38 |    114393 |        1093 |           5
        5 | Calumet        |     94.35 |     72386 |        1065 |           6
        6 | Gresham        |     97.05 |     94465 |        1026 |           7
        3 | Grand Crossing |     89.81 |     83850 |        1013 |           8
        7 | Englewood      |     94.89 |     69437 |         997 |           9
        9 | Deering        |     13.79 |    180602 |         926 |          10
        2 | Wentworth      |     70.62 |    102966 |         894 |          11
       25 | Grand Central  |      17.1 |    200227 |         711 |          12
       22 | Morgan Park    |     60.48 |    103381 |         682 |          13
       12 | Near West      |     18.65 |    141189 |         515 |          14
       17 | Albany Park    |      3.44 |    148892 |         460 |          15
       18 | Near North     |      8.16 |    121085 |         430 |          16
        1 | Central        |     20.64 |     71809 |         424 |          17
       16 | Jefferson Park |      1.29 |    212499 |         355 |          18
       19 | Town Hall      |      6.14 |    208425 |         326 |          19
       24 | Rogers Park    |     17.96 |    142599 |         325 |          20
       14 | Shakespeare    |      8.07 |    120168 |         298 |          21
       20 | Lincoln        |     11.56 |     87887 |         198 |          22
(22 rows)
```


### ii. Arrests totals by district are widely dispersed.


~~~~{.python}
exec_psql("""
    psql -d jdiv -c 'COPY (SELECT num_arrests FROM arrests_by_district) TO STDOUT' | 
    csvstat -H""")
~~~~~~~~~~~~~

```
  1. column1
	<class 'int'>
	Nulls: False
	Min: 198
	Max: 1765
	Sum: 17783
	Mean: 808.3181818181819
	Median: 802.5
	Standard Deviation: 438.36922859447196
	Unique values: 22
Row count: 22
```


## 1. b. Even in districts that are not predominantly black, juveniles arrested are.

### i. There are nine police districts where over half the population is black.


~~~~{.python}
exec_psql("select count(*) from police_district_metadata where pct_black >= 50")
~~~~~~~~~~~~~

```
 count 
-------
     9
(1 row)
```


There are 17 where over half of juveniles arrested are black. 


~~~~{.python}
exec_psql("select count(*) from district_profiles where pct_arrests_black >= 50")
~~~~~~~~~~~~~

```
 count 
-------
    17
(1 row)
```


### ii. In majority non-white districts, there is a marked difference between racial makeup of the district and racial makeup of juveniles who are arrested.


~~~~{.python}
exec_psql("""
    SELECT
      dist_num,
      dist_name,
      pct_arrests_black,
      pct_pop_black,
      pct_arrests_black::numeric - pct_pop_black AS pop_arrest_diff
    FROM district_profiles
    WHERE pct_pop_black < 50
    ORDER BY pop_arrest_diff DESC""")
~~~~~~~~~~~~~

```
 dist_num |   dist_name    | pct_arrests_black | pct_pop_black | pop_arrest_diff 
----------+----------------+-------------------+---------------+-----------------
       18 | Near North     |             89.30 |          8.16 |           81.14
        1 | Central        |             86.56 |         20.64 |           65.92
       24 | Rogers Park    |             70.77 |         17.96 |           52.81
       19 | Town Hall      |             56.13 |          6.14 |           49.99
       12 | Near West      |             66.21 |         18.65 |           47.56
       20 | Lincoln        |             52.02 |         11.56 |           40.46
        8 | Chicago Lawn   |             58.01 |         20.68 |           37.33
       10 | Ogden          |             66.97 |         32.38 |           34.59
        9 | Deering        |             47.41 |         13.79 |           33.62
       14 | Shakespeare    |             39.93 |          8.07 |           31.86
       25 | Grand Central  |             45.29 |          17.1 |           28.19
       17 | Albany Park    |             28.04 |          3.44 |            24.6
       16 | Jefferson Park |             20.00 |          1.29 |           18.71
(13 rows)
```


## 2. a. Youth from majority-black neighborhoods are overrepresented among youth arrested for a dime bag or less of marijuana.

### i. “Drug abuse violations” was the number one charge for which juveniles were arrested in 2014.


~~~~{.python}
exec_psql("""
    SELECT 
      offense, 
      num_misdemeanor, 
      num_felony, 
      num_other, 
      mf_ratio, 
      total 
    FROM charge_totals 
    LIMIT 5""")
~~~~~~~~~~~~~

```
             offense              | num_misdemeanor | num_felony | num_other | mf_ratio | total 
----------------------------------+-----------------+------------+-----------+----------+-------
 DRUG ABUSE VIOLATIONS            |            1884 |       1065 |        12 |     1.77 |  2961
 MISCELLANEOUS NON-INDEX OFFENSES |            2111 |         43 |        82 |    49.09 |  2236
 DISORDERLY CONDUCT               |            1720 |         22 |       362 |    78.18 |  2104
 SIMPLE BATTERY                   |            1836 |          1 |         0 |  1836.00 |  1837
 LARCENY - THEFT (INDEX)          |            1430 |        238 |        10 |     6.01 |  1678
(5 rows)
```


### iii. There were more misdemeanor drug arrests than felony drug arrests.


~~~~{.python}
exec_psql("""
    SELECT 
      SUM(felony) AS felonies, 
      SUM(misdemeanor) AS misdemeanors 
    FROM charges_2014 
    WHERE offense LIKE 'DRUG%'""")
~~~~~~~~~~~~~

```
 felonies | misdemeanors 
----------+--------------
     1065 |         1884
(1 row)
```


### iv. Youth from majority black neighborhoods – a quarter of Chicago's population – accounted for over half of misdemeanor drug arrests.


~~~~{.python}
exec_psql("""
    SELECT
      SUM(CASE WHEN pct_black >= 50 THEN misdemeanor END) AS majority_black,
      SUM(CASE WHEN pct_black < 50 THEN misdemeanor END) AS majority_non_black
    FROM charges_2014 AS v
    JOIN police_district_metadata AS met
      ON v.dist_num = met.dist_num
    WHERE offense LIKE 'DRUG%'""")
~~~~~~~~~~~~~

```
 majority_black | majority_non_black 
----------------+--------------------
           1025 |                859
(1 row)
```


## 2. b. Youth from majority-black neighborhoods are also overrepresented among youth arrested for disorderly conduct.

### i. We see the same pattern when examining arrests for disorderly conduct.


~~~~{.python}
exec_psql("""
    SELECT
      SUM(CASE WHEN pct_black >= 50 THEN misdemeanor END) AS majority_black,
      SUM(CASE WHEN pct_black < 50 THEN misdemeanor END) AS majority_non_black
    FROM charges_2014 AS v 
    JOIN police_district_metadata AS met 
      ON v.dist_num = met.dist_num 
    WHERE offense LIKE 'DISORDERLY%'""")
~~~~~~~~~~~~~

```
 majority_black | majority_non_black 
----------------+--------------------
            937 |                783
(1 row)
```


## APPENDIX: Population calculations

**Total population**


~~~~{.python}
exec_psql("select sum(total_pop) from police_district_metadata")
~~~~~~~~~~~~~

```
   sum   
---------
 2792364
(1 row)
```


**Black population**

Population in majority black districts


~~~~{.python}
exec_psql("select sum(total_pop) from police_district_metadata where pct_black >= 50")
~~~~~~~~~~~~~

```
  sum   
--------
 786017
(1 row)
```


Overall black population


~~~~{.python}
exec_psql("select sum(black_pop) from police_district_metadata")
~~~~~~~~~~~~~

```
  sum   
--------
 898600
(1 row)
```


**Non-black population**

Population in majority non-black districts


~~~~{.python}
exec_psql("select sum(total_pop) from police_district_metadata where pct_black < 50")
~~~~~~~~~~~~~

```
   sum   
---------
 2006347
(1 row)
```

