

## 1. a. Black youth account for 79% of juvenile arrents.


~~~~{.python}
exec_psql("""
    SELECT 
      race, 
      num_arrests, 
      ROUND(
        num_arrests / SUM(
          num_arrests) OVER (), 2) AS pct_total 
    FROM arrests_by_race""")
~~~~~~~~~~~~~

```
          race           | num_arrests | pct_total 
-------------------------+-------------+-----------
 BLACK                   |       14093 |      0.79
 WHITE HISPANIC          |        2981 |      0.17
 WHITE                   |         530 |      0.03
 BLACK HISPANIC          |         120 |      0.01
 ASIAN/PACIFIC ISLANDER  |          48 |      0.00
 UNKNOWN                 |           6 |      0.00
 AMER IND/ALASKAN NATIVE |           4 |      0.00
 AMER IND1ALASKAN NATIVE |           1 |      0.00
(8 rows)
```


83% of youth arrested are male.

## 1. b. Youth in majority-black neighborhoods are arrested at a disproportionately high rate.

### i. There are nine police districts where the total population is more than half black, and 10 where the male juvenile population is more than half black. 

Seven of them are among the 10 districts where the most arrests occur. 


~~~~{.python}
exec_psql("""
    SELECT
      met.dist_num, 
      dist_name, 
      pct_juv_black,
      pct_pop_black, 
      num_arrests
    FROM police_district_metadata AS met 
    JOIN arrests_by_district AS arr
      ON met.dist_num = arr.dist_num
    ORDER BY num_arrests DESC
    LIMIT 10""")
~~~~~~~~~~~~~

```
 dist_num |   dist_name    | pct_juv_black | pct_pop_black | num_arrests 
----------+----------------+---------------+---------------+-------------
       11 | Harrison       |         89.02 |         84.53 |        1765
        8 | Chicago Lawn   |         19.16 |         20.09 |        1598
       15 | Austin         |         95.76 |         93.29 |        1348
        4 | South Chicago  |         59.45 |         62.45 |        1334
       10 | Ogden          |          31.1 |         31.54 |        1093
        5 | Calumet        |         94.94 |         94.35 |        1065
        6 | Gresham        |         98.93 |         97.11 |        1026
        3 | Grand Crossing |         92.88 |         89.66 |        1013
        7 | Englewood      |         93.92 |         94.89 |         997
        9 | Deering        |         11.28 |         13.52 |         926
(10 rows)
```


59.3% of juvenile arrests occur in police districts where over half the male juvenile population is black.


~~~~{.python}
exec_psql("""
    SELECT 
      SUM(
        CASE WHEN pct_juv_black >= 50 THEN num_arrests END) / SUM(num_arrests) AS maj_black, 
      SUM(
        CASE WHEN pct_juv_black < 50 THEN num_arrests END) / SUM(num_arrests) AS other
    FROM arrests_by_district AS arr
    JOIN police_district_metadata AS met
      ON arr.dist_num = met.dist_num""")
~~~~~~~~~~~~~

```
       maj_black        |         other          
------------------------+------------------------
 0.59315076196367317101 | 0.40684923803632682899
(1 row)
```


### ii. Arrests totals by district are widely dispersed.


~~~~{.python}
exec_psql("""
    SELECT 
      AVG(num_arrests),
      STDDEV(num_arrests)
    FROM arrests_by_district""")
~~~~~~~~~~~~~

```
         avg          |      stddev      
----------------------+------------------
 808.3181818181818182 | 448.685210084885
(1 row)
```


## 1. c. Even in districts that are not predominantly black, juveniles arrested are.

### i. There are 10 police districts where over half of male juveniles are black.


~~~~{.python}
exec_psql("select count(*) from police_district_metadata where pct_juv_black >= 50")
~~~~~~~~~~~~~

```
 count 
-------
    10
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
      pct_juv_black,
      pct_arrests_black - pct_juv_black AS pop_arrest_diff
    FROM district_profiles
    WHERE pct_juv_black < 50
    ORDER BY pop_arrest_diff DESC""")
~~~~~~~~~~~~~

```
 dist_num |   dist_name    | pct_arrests_black | pct_juv_black | pop_arrest_diff 
----------+----------------+-------------------+---------------+-----------------
       18 | Near North     |             89.30 |         23.66 |           65.64
       24 | Rogers Park    |             70.77 |         18.92 |           51.85
       19 | Town Hall      |             56.13 |         11.09 |           45.04
       20 | Lincoln        |             52.02 |         11.17 |           40.85
        8 | Chicago Lawn   |             58.01 |         19.16 |           38.85
        9 | Deering        |             47.41 |         11.28 |           36.13
       10 | Ogden          |             66.97 |          31.1 |           35.87
       25 | Grand Central  |             45.29 |         17.01 |           28.28
       12 | Near West      |             66.21 |          39.7 |           26.51
       17 | Albany Park    |             28.04 |          3.49 |           24.55
       14 | Shakespeare    |             39.93 |         18.65 |           21.28
       16 | Jefferson Park |             20.00 |          1.34 |           18.66
(12 rows)
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


### iv. Youth from majority black neighborhoods – home to about a third of Chicago's total population, and three-quarters of its black juveniles – accounted for over half of misdemeanor drug arrests.


~~~~{.python}
exec_psql("""
    SELECT
      SUM(CASE WHEN pct_juv_black >= 50 THEN misdemeanor END) AS majority_black,
      SUM(CASE WHEN pct_juv_black < 50 THEN misdemeanor END) AS other
    FROM charges_2014 AS v
    JOIN police_district_metadata AS met
      ON v.dist_num = met.dist_num
    WHERE offense LIKE 'DRUG%'""")
~~~~~~~~~~~~~

```
 majority_black | other 
----------------+-------
           1040 |   844
(1 row)
```


## 2. b. Youth from majority-black neighborhoods are also overrepresented among youth arrested for disorderly conduct.

### i. We see a pattern similar to misdemeanor drug arrests when examining arrests for disorderly conduct.


~~~~{.python}
exec_psql("""
    SELECT
      SUM(CASE WHEN pct_juv_black >= 50 THEN misdemeanor END) AS majority_black,
      SUM(CASE WHEN pct_juv_black < 50 THEN misdemeanor END) AS other
    FROM charges_2014 AS v 
    JOIN police_district_metadata AS met 
      ON v.dist_num = met.dist_num 
    WHERE offense LIKE 'DISORDERLY%'""")
~~~~~~~~~~~~~

```
 majority_black | other 
----------------+-------
            961 |   759
(1 row)
```


## APPENDIX: Population calculations

Police districts where more than half of male juveniles are black are home to 31% of the population – and 74% of black male juveniles.


~~~~{.python}
exec_psql("""
  SELECT bmj_maj_black, 
  total_bmj, 
  ROUND(bmj_maj_black::numeric / total_bmj, 2) AS pct, 
  total_pop_maj_black, 
  total_pop, 
  ROUND(total_pop_maj_black::numeric / total_pop, 2) AS pct
  FROM (
    SELECT 
      SUM(CASE WHEN pct_juv_black >= 50 THEN black_male_juvenile_pop END) AS bmj_maj_black, 
      SUM(black_male_juvenile_pop) AS total_bmj, 
      SUM(CASE WHEN pct_juv_black >= 50 THEN total_pop END) AS total_pop_maj_black, 
      SUM(total_pop) AS total_pop 
    FROM police_district_metadata) t""")
~~~~~~~~~~~~~

```
 bmj_maj_black | total_bmj | pct  | total_pop_maj_black | total_pop | pct  
---------------+-----------+------+---------------------+-----------+------
         41137 |     55835 | 0.74 |              884425 |   2863919 | 0.31
(1 row)
```
