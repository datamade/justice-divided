# ⚖ Justice Divided

[Justice Divided](https://justicedivided.com) is an educational tool and resource repository meant to promote awareness of disproportionate minority contact (DMC), or the overrepresentation of black youth in the juvenile justice system.

Within the system, the first steps toward equitable justice are acknowledging DMC as a problem of race, accepting joint responsibility, and making a deliberate effort to address its root causes.

Outside the system, we can and should demand these changes from policy makers and practitioners.

This website is intended to facilitate all the above.

## Setup 

#### 📊 For data, see [the data documentation](https://github.com/datamade/justice-divided/tree/master/data).

Justice Divided is built using [Jekyll](https://jekyllrb.com/), a static site generator that runs on Ruby. If you don't have Ruby installed, we recommend you manage your installation with [rbenv](https://github.com/rbenv/rbenv) or [RVM](https://rvm.io/).

### Getting started

Once you have the correct Ruby version up and running, install the package manager Bundler:

```
gem install bundler
```

Then clone this project and install its dependencies using Bundler:

```
git clone https://github.com/datamade/justice-divided.git
cd justice-divided
bundle install
```

To run the site locally, run the following command:

```
jekyll serve
```

Then open your web browser and navigate to http://localhost:5000 (or whatever server address Jekyll printed to your console).

### Dependencies 

We used the following open-source tools:

* [Bootstrap](http://getbootstrap.com/)
* [Leaflet](http://leafletjs.com/)
* [Highcharts](https://www.highcharts.com/)

## Team

Justice Divided is a joint effort of [Illinois Justice Project](http://www.iljp.org/), [Adler University](http://www.adler.edu/), and [DataMade](https://datamade.us), with funding from the [Polk Bros. Foundation](http://www.polkbrosfdn.org/).

The development team is:

* [Hannah Cushman](https://twitter.com/hancush) - data, research, design, development
* [Forest Gregg](https://github.com/fgregg) - data, research, design
* [Derek Eder](https://github.com/derekeder) - design, development

Special thanks to Era Laudermilk at ILJP, Dan Cooper at Adler, and Mariame Kaba at Project NIA for contributing data and invaluable feedback during development; and Martin Macias, Jr., of City Bureau for contributing reporting.

## Errors and bugs

If something is not behaving intuitively, it is a bug and should be reported.
[Report it here by creating an issue](https://github.com/datamade/justice-divided/issues).

Help us fix the problem as quickly as possible by following [Mozilla's guidelines for reporting bugs.](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Bug_writing_guidelines#General_Outline_of_a_Bug_Report)

## Patches and pull requests

Your patches are welcome. Here's our suggested workflow:
 
* Fork the project.
* Make your feature addition or bug fix.
* Send us a pull request with a description of your work. Bonus points for topic branches!

## Copyright and attribution

Copyright (c) 2016 DataMade. Released under the [MIT License](https://github.com/datamade/justice-divided/blob/master/LICENSE).