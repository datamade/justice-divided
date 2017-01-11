.INTERMEDIATE : charges.clean.csv
charges.clean.csv : raw/arrests_by_charge_14.csv
	(echo dist_num,offense,felony,misdemeanor,other,total; \
	csvcut -c 2,3,4,5,6,7 $< | \
	tail -n +6 | head -n 595 | \
	perl -p -e 's/\s?,\s?/,/g; s/ {2,}/ /g') > $@

output/arrests_by_charge_14.csv : charges.clean.csv raw/cpd-dist-names.csv
	csvjoin -c "dist_num,dist_num" $^ | csvcut -c 1,7,2,3,4,5,6 > $@

.PHONY : charge-totals
charge-totals : output/arrests_by_charge_14.csv
	csvsql --query 'select offense, round(cast(sum(misdemeanor) as float)/sum(felony),2) as mf_ratio, \
	sum(other) as num_unclassified, sum(total) as total from $(notdir $(basename $<)) group by offense' $<

.PHONY : class-totals
class-totals : output/arrests_by_charge_14.csv
	csvsql --query 'select sum(misdemeanor) as num_misdemeanor, sum(felony) as num_felony, \
	sum(other) as num_unclassified from $(notdir $(basename $<))' $<

.PHONY : class-totals-by-district
class-totals-by-district : output/arrests_by_charge_14.csv
	csvsql --query 'select dist_num, dist_name, sum(misdemeanor) as num_misdemeanor, sum(felony) as num_felony, \
	sum(other) as num_unclassified from $(notdir $(basename $<)) group by dist_num' $<

.PHONY : top-charge-by-district
top-charge-by-district : output/arrests_by_charge_14.csv
	csvsql --query 'select dist_num, dist_name, offense, misdemeanor, felony, other, \
	max(total) as total from $(notdir $(basename $<)) group by dist_num' $<

.PHONY : mf-ratios-by-district
mf-ratios-by-district : 
	make class-totals-by-district -s | csvsql --query 'select dist_num, dist_name, \
	round(cast(num_misdemeanor as float)/num_felony,2) as mf_ratio from stdin'
