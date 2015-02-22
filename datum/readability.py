#!/usr/bin/env python
# coding=utf-8

import httplib
import json
import os

from base import BaseObject


class Readability(BaseObject):

	def argument_parser(self):
		parser = super(Readability, self).argument_parser()

		parser.add_argument('datum_db_name', default='DATUM_DB', nargs='?', help='Environment variable name for datum database')
		parser.add_argument('readability_token_name', default='READABILITY_TOKEN', nargs='?', help='Environment variable name for Readability Parser token')

		return parser
		
	def prepare_for_main(self):
		self.datum_db = self.couchdb_client(self.args.datum_db_name)
		self.parser_token = os.environ[self.args.readability_token_name]

	def main(self):
		needs_parser = self.datum_db.view('feeds/has_demo_readability', key=False)

		for row in needs_parser:
			print row.id

			conn = httplib.HTTPConnection('readability.com')
			conn.request('GET', '/api/content/v1/parser?url=%s&token=%s' % (row.value, self.parser_token))
			response = conn.getresponse()
			json_data = json.loads(response.read())

			doc = self.datum_db[row.id]
			doc['demo_readability'] = json_data
			self.datum_db.save(doc)


def main(args=None):
	return Readability(args=args).run()


if __name__ == '__main__':
	main()