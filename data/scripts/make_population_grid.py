import csv
import string
import sys

from census import Census

from config import CENSUS_API_KEY

c = Census(CENSUS_API_KEY)

writer = csv.writer(sys.stdout)

def retrieve_acs5_table_data(table):
    """Retrieve place-level ACS5 data from Chicago. For other geographies,
    see the docs: https://www.census.gov/geo/maps-data/data/relationship.html.
    For table codes, see: http://api.census.gov/data/2015/acs5/variables.html.
    """
    table_data = c.acs5.state_place(('NAME', table), 17, 14000)
    field_data = int(table_data[0][table])
    return field_data

base_table = 'B01001'

table_pop = {'A': 'white_alone',
             'B': 'black_alone',
             'C': 'am_ind_alone',
             'D': 'asian_alone',
             'E': 'pac_isl_alone',
             'F': 'other_alone',
             'G': 'two_or_more'}

table_ext = ['05', '06', '20', '21']

writer.writerow([None,'male','female'])

for letter in list(string.ascii_uppercase)[:7]:
    f = 0
    m = 0
    for ext in table_ext:
        table = '{0}{1}_0{2}E'.format(base_table, letter, ext)
        data = retrieve_acs5_table_data(table)
        if ext.startswith('0'):
            m += data
        else:
            f += data
    writer.writerow([table_pop[letter],m,f])
