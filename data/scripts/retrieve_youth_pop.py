import csv
import sys

from census import Census

from config import CENSUS_API_KEY

c = Census(CENSUS_API_KEY)

def retrieve_acs5_table_data(table):
    """Retrieve place-level ACS5 data from Chicago. For other geographies,
    see the docs: https://www.census.gov/geo/maps-data/data/relationship.html.
    For table codes, see: http://api.census.gov/data/2015/acs5/variables.html.
    """
    table_data = c.acs5.state_place(('NAME', table), 17, 14000)
    field_data = int(table_data[0][table])
    return field_data

writer = csv.writer(sys.stdout)
writer.writerow(['race', 'population'])
# white males aged 18-19
writer.writerow(['white', retrieve_acs5_table_data('B01001A_007E')])
# black males aged 18-19
writer.writerow(['black', retrieve_acs5_table_data('B01001B_007E')])
