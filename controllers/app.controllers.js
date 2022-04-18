exports.getApi = (req, res, next) => {
	const endpointsJSON = require('../endpoints.json');
	res.status(200).send(endpointsJSON);
};
