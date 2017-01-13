

# Further analysis
(builds on Google doc with contextual data)




## Arrests

### The hidden disparity between misdemeanor and felony arrests

Overall, it appears that about an equal number of drug charges are misdemeanors and felonies. 


```
 felonies | misdemeanors 
----------+--------------
     1065 |         1884
(1 row)
```


However, an extraordinarily high number of felony drug arrests in one district – 629 in Harrison (11), six times the next highest total of 96 in Austin (15) – accounts for more than half of all felony drug arrests of juveniles in 2014. If we exclude that district, we see there are far more misdemeanor drug arrests in the remaining districts.


```
 felonies | misdemeanors 
----------+--------------
      413 |         1734
(1 row)
```


The only drug offense that can be a misdemeanor in Chicago is possession of less than 30g of marijuana, sale of less than 10g, or growing fewer than five plants.

We can intuit then that the count of misdemeanor drug arrests is the count of arrests for low-level marijuana offenses. Everywhere but in the 11th district, many more juveniles are being arrested on these charges than on more serious drug offenses. (Note: Working to confirm this logic.)

An even starker example of this pattern is true of disorderly conduct.


```
 felonies | misdemeanors 
----------+--------------
       22 |         1720
(1 row)
```


### Other notable disparities 

There is a marked disparity in many districts between racial makeup of the population and racial makeup of juveniles arrested.


```
 dist_num |   dist_name    | pct_arrests_black | pct_pop_black | pop_arrest_diff  
----------+----------------+-------------------+---------------+------------------
       18 | Near North     |             89.30 |          8.16 |            81.14
        1 | Central        |             86.56 |         20.64 |            65.92
       24 | Rogers Park    |             70.77 |         17.96 |            52.81
       19 | Town Hall      |             56.13 |          6.14 |            49.99
       12 | Near West      |             66.21 |         18.65 |            47.56
       20 | Lincoln        |             52.02 |         11.56 |            40.46
        8 | Chicago Lawn   |             58.01 |         20.68 |            37.33
       22 | Morgan Park    |             96.04 |         60.48 |            35.56
       10 | Ogden          |             66.97 |         32.38 |            34.59
        9 | Deering        |             47.41 |         13.79 |            33.62
       14 | Shakespeare    |             39.93 |          8.07 |            31.86
       25 | Grand Central  |             45.29 |          17.1 |            28.19
        2 | Wentworth      |             97.76 |         70.62 |            27.14
       17 | Albany Park    |             28.04 |          3.44 |             24.6
        4 | South Chicago  |             83.81 |         61.17 |            22.64
       16 | Jefferson Park |             20.00 |          1.29 |            18.71
       11 | Harrison       |             97.17 |         84.05 |            13.12
        3 | Grand Crossing |             99.80 |         89.81 | 9.98999999999999
       15 | Austin         |             98.44 |         93.06 |             5.38
        5 | Calumet        |             98.40 |         94.35 | 4.05000000000001
        7 | Englewood      |             98.80 |         94.89 |             3.91
        6 | Gresham        |             98.73 |         97.05 | 1.68000000000001
(22 rows)
```


There is also an incongruency between where graffiti occurs and where juveniles are arrested for vandalism, in particular in North Side district **Shakespeare (14)**, which has had the third-highest number of graffiti removal calls since 2011 compared to a relatively low number of arrests for vandalism.


```
 dist_num |   dist_name    | pct_black | vandalism_arrests | graffiti_reports | rank 
----------+----------------+-----------+-------------------+------------------+------
        8 | Chicago Lawn   |     20.68 |               118 |           115555 |    1
        9 | Deering        |     13.79 |                70 |           105573 |    2
       10 | Ogden          |     32.38 |                46 |            71173 |    5
       25 | Grand Central  |      17.1 |                41 |            73065 |    4
        4 | South Chicago  |     61.17 |                40 |            21767 |   12
       17 | Albany Park    |      3.44 |                33 |            69418 |    6
        6 | Gresham        |     97.05 |                31 |             2163 |   22
       12 | Near West      |     18.65 |                28 |            63525 |    7
       15 | Austin         |     93.06 |                26 |             3451 |   17
        5 | Calumet        |     94.35 |                21 |             2620 |   19
        7 | Englewood      |     94.89 |                20 |             3799 |   16
       16 | Jefferson Park |      1.29 |                20 |            27633 |   10
       14 | Shakespeare    |      8.07 |                20 |            93861 |    3
       11 | Harrison       |     84.05 |                18 |             7589 |   15
       19 | Town Hall      |      6.14 |                15 |            58888 |    8
        1 | Central        |     20.64 |                15 |            17423 |   14
       24 | Rogers Park    |     17.96 |                14 |            29361 |    9
        2 | Wentworth      |     70.62 |                14 |             3181 |   18
       20 | Lincoln        |     11.56 |                12 |            22384 |   11
        3 | Grand Crossing |     89.81 |                 9 |             2346 |   20
       22 | Morgan Park    |     60.48 |                 9 |             2297 |   21
       18 | Near North     |      8.16 |                 6 |            19830 |   13
(22 rows)
```


What happens to the kids who are arrested? About half are referred to court. Another third are granted station adjustments. The remaining fifth are detained.

## Detention

Drug charges are the top reason for juvenile arrests in Chicago – these are the ones for which juveniles are sent to JTDC.


```
                              charge                              | admit_num | alos  
------------------------------------------------------------------+-----------+-------
 PCS - any amount of controlled substance not covered in subs     |       163 | 20.35
 PCS - 15 but less than 100 grams of cocaine                      |        88 | 17.73
 DCS/PCS with intent - any other amount of a controlled substance |        54 | 14.22
 Pcan - not more than 2.5 grams                                   |        35 |    10
 PCS/DCS - 10 but less than 15 grams of heroin                    |        19 | 16.45
 PCS - 15 but less than 100 grams of heroin                       |        12 |  5.58
 DCS/PCS with intent - 10 but less than 15 grams of heroin        |        10 |  13.6
 DCS/PCS with intent - 1 but less than 15 grams or cocaine        |         8 | 16.38
 Pcan deliver or intent to deliver - more than 2.5 but not m      |         8 |    17
 DCS/PCS with intent - 15 or more but less than 100 grams         |         3 |    10
(10 rows)
```

