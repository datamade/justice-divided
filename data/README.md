recipes for generating clean versions of district demographic, arrest, disposition and djj exit data (`make all`), plus phony targets for the following analysis:

## arrests
* **district-totals**: total arrests per police district
* **race-totals**: total arrests by race
* **ratio-black**: % of arrestees who are black, per police district

## charges
* **charge-totals**: arrest totals and misdemeanor-felony ratios (number of misdemeanors divided by number of felonies; more felonies < 1 < more misdemeanors, where 0 is all felonies) for each of the charges in the data
* **class-totals**: misdemeanor, felony & other arrest totals for each of the charges in the data
* **class-totals-by-district**: misdemeanor, felony & other arrest totals for each police district
* **mf-ratios-by-district**: misdemeanor-felony ratios, as described above, for each police district
* **top-charge-by-district**: charge with the highest number of arrests for each police district

## dispositions
* **adjustment-ratios**: % of arrestees who are granted a station adjustment, per police district
* **detention-totals**: number of arrestees who are sent to detention center, per police district
* **dentention-ratios**: % of arrestees who are sent to detention center, per police district
* **release-total**: total number of arrestees released with charges
  
## djj exits
* **djj-race-totals**: total djj exits by race
