#!/usr/bin/env python
# coding=utf-8

import os
import sys

from setuptools import setup, find_packages

if not hasattr(sys, 'version_info') or sys.version_info < (2, 6, 0, 'final'):
	sys.exit('datum requires Python 2.6 or later.')

setup(
	name = 'datum',
	version = '0.1',

	author = 'King Chung Huang',
	author_email = 'kinghuang@mac.com',
	description = 'Processing scripts to support datum.',

	packages = find_packages(),
	install_requires = [
		'CouchDB>=0.9',
		'python_daemon>=1.6',
		'argparse>=1.1',
		'requests>=2.2.1',
		'unicodecsv>=0.9.4',
		'progressbar>=2.2'
	],

	entry_points = {
		'console_scripts': [

		]
	},

	zip_safe = True
)