const CosmosDB = require('../app/database/database-singleton');

exports.getResources = async (req, res) => {
    try{
        const service = await CosmosDB.getInstance();
        const resources = await service.queryItems('SELECT * from c', 'resources');
        res.json(resources);
    } 
    catch (error){
        res.status(500).json({error: error.message});
    }
};

exports.createResource = async (req, res) => {
    try{
        const service = await CosmosDB.getInstance();
        const newResource = await service.addItem(req.body, 'resources');
        res.status(201).json(newResource);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}