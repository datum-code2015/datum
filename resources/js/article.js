(function($) {
	var Article = Article || {};

	Article.getArticle = function() {
		var doc_id = window.location.hash.substring(1);
		if (doc_id != "") {
			var db = $.couch.db('datum');
			var doc = db.openDoc(doc_id, {
				success: function(doc) {
					var readability = doc['demo_readability'];

					var container = $('#article').empty();
					var article = '<div>Date: ' + readability['date_published'] + '</div>' +
												'<h1>' + readability['title'] + '</h1>' +
												readability['content'];

					container.append(article);

					Article.updateDatasets(doc);
				}
			});
		}
	};

	Article.updateDatasets = function(doc) {
		$('#datasets').empty();
		var specs = doc['demo_datasets'];

		for (var i in specs) {
			Article.updateDataset(specs[i]);
		}
	};

	Article.updateDataset = function(spec) {
		$.couch.db('datum').openDoc(spec['id'], {
			success: function(dataset_doc) {
				var url = dataset_doc['endpoint'];
				if ('aggregation' in spec) {
					url += '/aggregation';
				}
				url += '?api_key=502750090683beba5dc16e2fec6f8ea3f55882d82997086325464a7cbd16ecd4';
				if ('select' in spec) {
					url += '&select=' + spec['select'].join(',');
				}
				if ('aggregation' in spec) {
					url += '&operation=' + spec['aggregation'];
				}
				if ('where' in spec) {
					url += '&where=' + spec['where']
				}

				$.ajax({
					dataType: 'jsonp',
					url: url,
					success: function(data, status, jqXHR) {
						var result = '<h2>' + dataset_doc['name'] + '</h2>';
						if ('title' in spec) {
							result += '<h3>' + spec['title'] + '</h3>';
						}
						result += '<div>' + JSON.stringify(data) + '</div>';

						$('#datasets').append(result);
					}
				});
			}
		});
	}

	var init = function(context, settings) {
		// $.couch.urlPrefix = 'http://127.0.0.1:5984';

		Article.getArticle();

		window.addEventListener('hashchange', Article.getArticle, false);
	}

	$(document).ready(init);

}).call(this, jQuery);