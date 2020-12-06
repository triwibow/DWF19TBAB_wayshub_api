const {
    Chanel,
    Subscribe,
    Video,
    Comment
} = require('../../models');

const Joi = require('joi');

const addSubscribe = async (req, res) => {
    try {
        const { id } = req.user;
        const { body } = req;

        console.log(body.chanelId);

        const isChanelExist = await Chanel.findOne({
            where : {
                id: body.chanelId
            }
        });

        console.log(isChanelExist);

        if(id === body.chanelId){
            return res.status(400).send({
                status: 'error',
                error: {
                    message: "Cannot subscribe"
                }
            });
        }

        if(!isChanelExist){
            return res.status(400).send({
                status: 'error',
                error: {
                    message: "chanel not exist"
                }
            });
        }

        const isSubscribed = await Subscribe.findOne({
            where: {
                chanelId: body.chanelId,
                subscriberId: id
            }
        });

        const schema = Joi.object({
            chanelId: Joi.number().integer().required()
        });

        const { error } = schema.validate(body ,{
            abortEarly: false
        });

        if(error){
            return res.status(400).send({
                status: 'error',
                error: {
                    message: error.details.map(err => {
                        return {
                            [err.path] : err.message
                        };
                    })
                }
            });
        }

        if(isSubscribed){
            return res.status(400).send({
                status: 'error',
                error: {
                    message: "Already subscribe to this chanel"
                }
            });
        }

        await Subscribe.create({
            ...body,
            subscriberId: id
        });

        const chanel = await Chanel.findOne({
            where: {
                id: body.chanelId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });

        res.send({
            status: "success",
            data: {
                subscribe: {
                    chanel
                }
            }
        })

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: "error",
            messages: "server error"
        });
    }
}

const unSubscribe = async (req, res) => {
    try {
        const { id:subscriberId } = req.user;
        const { chanelId } = req.params;

        const isSubscribed = await Subscribe.findOne({
            where: {
                chanelId,
                subscriberId
            }
        });

        if(!isSubscribed){
            return res.status(400).send({
                status: 'error',
                error: {
                    message: "Resource not found"
                }
            });
        }

        isSubscribed.destroy();

        res.send({
            status: "success",
            data: {
                id: chanelId
            }
        })

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: "error",
            messages: "server error"
        });
    }
}

const getSubscribers = async (req, res) => {
    try {
        const { id } = req.user;
        const subscribtion = await Chanel.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'chanelName', 'thumbnail', 'photo', 'id', 'email', 'description']
            },
            include: {
                model: Chanel,
                as: 'subscribers',
                through: {
                    attributes : []
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password']
                }
            }
        });

        if(!subscribtion){
            return res.status(400).send({
                status: 'error',
                error: {
                    message: "Resource not found"
                }
            });
        }

        if(subscribtion.subscribers.length === 0){
            return res.status(400).send({
                status: 'error',
                error: {
                    message: "Dont have subscriber"
                }
            });
        }


        res.send({
            status: "success",
            data : {
                subscribtion: subscribtion.subscribers,
            }
        });

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: "error",
            messages: "server error"
        });

    }
}

exports.addSubscribe = addSubscribe;
exports.unSubscribe = unSubscribe;
exports.getSubscribers = getSubscribers;