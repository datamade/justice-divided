.INTERMEDIATE : disp.clean.csv
disp.clean.csv : raw/disp-by-dist-14.csv
	csvcut -C 1 $^ | tail -n +4 | head -n 311 | perl -p -e 's/ ,/,/g; s/, /,/g; s/ $$//' > $@

.INTERMEDIATE : disp.pivot.csv
disp.pivot.csv : disp.clean.csv
	(echo 'district,disposition,female,male,unknown,total'; cat $< | python scripts/add_dist.py) > $@

output/disp-by-dist-14.csv : disp.pivot.csv raw/cpd-dist-names.csv
	csvjoin -c "district,dist_num" $^ | csvcut -c 7,8,2,6 > $@

.PHONY : adjustment-ratios
adjustment-ratios : output/disp-by-dist-14.csv
	csvsql --query 'select dist_num, dist_name, sum(case when disposition like "%ADJUSTMENT%" then total else 0 end) \
	as adjustments, sum(Total) as total from "$(notdir $(basename $<))" group by dist_num' $< | \
	csvsql --query 'select dist_num, dist_name, adjustments, total, \
	round(cast(adjustments as float)/total*100,2) as adjustment_ratio from stdin order by adjustment_ratio desc'

.PHONY : adjustment-graph
adjustment-graph : adjustment-ratios
	make $< -s | csvsort -c total -r | python scripts/make_table.py 'dist_name' 'adjustment_ratio'

.PHONY : detention-totals
detention-totals : output/disp-by-dist-14.csv
	csvgrep -c disposition -m 'DETAINED (DETENTION CENTER)' $< | csvcut -C 3

.PHONY : detention-ratios
detention-ratios : output/disp-by-dist-14.csv
	csvsql --query 'select dist_num, dist_name, sum(case when disposition = "DETAINED (DETENTION CENTER)" then total else 0 end) \
	as detentions, sum(Total) as total from "$(notdir $(basename $<))" group by dist_num' $< | \
	csvsql --query 'select dist_num, dist_name, detentions, total, \
	round(cast(detentions as float)/total*100,2) as detention_ratio from stdin order by detention_ratio desc'

.PHONY : detention-graph
detention-graph : detention-ratios
	make $< -s | csvsort -c total -r | python scripts/make_table.py 'dist_name' 'detention_ratio'

.PHONY : release-total
release-total : 
	csvgrep -r '^RELEASED' -c 3 output/disp-by-dist-14.csv | csvstat -c total --sum