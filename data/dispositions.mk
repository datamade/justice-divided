.INTERMEDIATE : disp.clean.csv
disp.clean.csv : raw/disp-by-dist-14.csv
	csvcut -C 1 $^ | tail -n +4 | head -n 311 | perl -p -e 's/ ,/,/g; s/, /,/g; s/ $$//' > $@

.INTERMEDIATE : disp.pivot.csv
disp.pivot.csv : disp.clean.csv
	(echo 'district,disposition,female,male,unknown,total'; cat $< | python scripts/add_dist.py) > $@

output/disp-by-dist-14.csv : disp.pivot.csv raw/cpd-dist-names.csv output/police_district_demographics.csv
	csvjoin -c "district,dist_num" $< $(word 2, $^) | \
	csvjoin -c "district,dist_num" - $(word 3, $^) | \
	csvcut -c district,dist_name,black_pop,total_pop,pct_black,disposition,total > $@

.PHONY : adjustment-ratios
adjustment-ratios : output/disp-by-dist-14.csv
	csvsql --query 'select district, dist_name, pct_black, sum(case when disposition like "%ADJUSTMENT%" then total else 0 end) \
	as num_adjustments, sum(Total) as num_arrests from "$(notdir $(basename $<))" group by district' $< | \
	csvsql --query 'select district, dist_name, pct_black, num_adjustments, num_arrests, \
	round(cast(num_adjustments as float)/num_arrests*100,2) as adjustment_ratio from stdin'

.PHONY : detention-totals
detention-totals : output/disp-by-dist-14.csv
	csvgrep -c disposition -m 'DETAINED (DETENTION CENTER)' $< | csvcut -C black_pop,total_pop,disposition

.PHONY : detention-ratios
detention-ratios : output/disp-by-dist-14.csv
	csvsql --query 'select district, dist_name, pct_black, \
	sum(case when disposition = "DETAINED (DETENTION CENTER)" then total else 0 end) as num_detentions, \
	sum(Total) as num_arrests from "$(notdir $(basename $<))" group by district' $< | \
	csvsql --query 'select district, dist_name, pct_black, num_detentions, num_arrests, \
	round(cast(num_detentions as float)/num_arrests*100,2) as detention_ratio from stdin'

.PHONY : release-total
release-total : 
	csvgrep -r '^RELEASED' -c disposition output/disp-by-dist-14.csv | csvstat -c total --sum