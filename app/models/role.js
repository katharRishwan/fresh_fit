const { mongoose } = require('../services/imports');

module.exports = mongoose.model(
    'role',
    new mongoose.Schema(
        {
            name: { type: String, uppercase: true },
            description: String,
            display: { type: Boolean, default: false },
            isDeleted: { type: Boolean, default: false }
        },
        { timestamps: true, versionKey: false }
    ),
    'role'
);
