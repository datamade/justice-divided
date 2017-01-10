.INTERMEDIATE : arrests.clean.csv
arrests.clean.csv : raw/arrests-14.csv
	perl -p -e 's/\s{2,}//; s/(AGE,{8}|TOTAL)/$$1\n/g' $< | tail -n +2 | head -n 111 | \
	python scripts/make_int.py > $@

.INTERMEDIATE : arrests.pivot.csv
arrests.pivot.csv : arrests.clean.csv
	(echo 'district,race,5-10,11,12,13,14,15,16,17,total'; csvcut -C 1 $< | python scripts/add_dist.py) > $@

output/arrests-14.csv : arrests.pivot.csv raw/cpd-dist-names.csv output/police_district_demographics.csv
	csvjoin -c "district,dist_num" $< $(word 2, $^) | \
	csvjoin -c "district,dist_num" - $(word 3, $^) | \
	csvcut -c district,dist_name,black_pop,total_pop,pct_black,race,total > $@

.PHONY : district-totals
district-totals : output/arrests-14.csv
	csvsql --query 'select district, dist_name, pct_black, sum(total) as num_arrests from "$(notdir $(basename $<))" \
	group by dist_name' $<

.PHONY : race-totals
race-totals : output/arrests-14.csv
	csvsql --query 'select race, sum(total) as num_arrests from "$(notdir $(basename $<))" \
	group by race' $< 

.PHONY : ratio-black
ratio-black : output/arrests-14.csv
	csvsql --query 'select district, dist_name, pct_black as pct_pop_black, \
	round(sum(case when race = "BLACK" then total else 0 end)/cast(sum(total) as float)*100,2) as pct_arrests_black \
	from "$(notdir $(basename $<))" group by dist_name' $<