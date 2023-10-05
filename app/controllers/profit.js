const responseMessages = require('../middlewares/response-messages');
const db = require('../models');
const ProfitModel = db.profit;

module.exports = {
    getProfit: async (req, res) => {
        try {
            const { startDate, endDate, status, date } = req.query;
            // const { error, validateData } = await validator.validateOrderGet(req.query);
            // if (error) {
            //     return res.clientError({
            //         msg: error
            //     })
            // }
            if (req.decoded.roleType !== 'ADMIN') {
                return res.clientError({
                    msg: 'something went wrong'
                })
            }
            const filterQuery = {};
            if (status === 'today') {
                // console.log('t0ady-------------');
                // const currentDate = new Date();
                // // Set the start and end times for today (midnight to 11:59:59 PM)
                // const startOfDay = new Date(currentDate);
                // startOfDay.setHours(0, 0, 0, 0); // Set to midnight
                // const endOfDay = new Date(currentDate);
                // endOfDay.setHours(23, 59, 59, 999);
                // filterQuery.date = { $gte: startOfDay, $lte: endOfDay }
                const today = new Date(); // Get the current date and time

                // Set the time to the beginning of the day (midnight)
                today.setHours(0, 0, 0, 0);

                // Calculate the end of the day by setting the time to 23:59:59.999
                const endOfDay = new Date(today);
                endOfDay.setHours(23, 59, 59, 999);
                filterQuery.date = {
                    $gte: today,
                    $lt: endOfDay,
                }
            } else if (date) {
                const today = new Date(date); // Get the current date and time
                // Set the time to the beginning of the day (midnight)
                today.setHours(0, 0, 0, 0);

                // Calculate the end of the day by setting the time to 23:59:59.999
                const endOfDay = new Date(today);
                endOfDay.setHours(23, 59, 59, 999);
                filterQuery.date = {
                    $gte: today,
                    $lt: endOfDay,
                }
            } else if (startDate && endDate) {
                console.log('finding dae-------------');
                const from = new Date(startDate);
                const to = new Date(endDate);
                filterQuery.date = { $gte: from, $lte: to }
            }
            console.log('filterQuery---', filterQuery);
            const data = await ProfitModel.find(filterQuery);
            console.log('date-----', data.length);
            let amount = 0;
            if (!data.length) {
                return res.success({
                    msg: 'orders not found',
                    result: amount,
                });
            }
            data.map((val) => {
                amount += val.amount
            })
            return res.success({
                msg: `profit is`,
                result: amount,
            });

        } catch (error) {
            console.log('error-', error);
        }
    }
}