var querystring = require('querystring')

var parsers = [
  {
    mime: 'application/x-www-form-urlencoded',
    parse: querystring.parse
  },
  {
    mime: 'application/json',
    parse: JSON.parse
  }
]

module.exports = function scalpel(req, res, next) {
  req.body = ''
  req.setEncoding('utf8')
  req.on('data', function(chunk) {req.body += chunk})
  req.on('end', function() {
    var i, parser, ct = req.headers['content-type']
    if (!req.body) return next()
    for (i=0; i<parsers.length; i++) {
      parser = parsers[i]
      if (ct && !ct.indexOf(parser.mime)) {
        try {
          req.parsedBody = parser.parse(req.body)
        } catch (e) {
          // just pass body as string if it can't be parsed
        }
      }
    }
    next()
  })
}
