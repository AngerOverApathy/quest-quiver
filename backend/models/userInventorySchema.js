const userInventorySchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    equipmentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Equipment' 
    },
    quantity: { 
        type: Number, 
        default: 1 
    },
    acquiredDate: { 
        type: Date, 
        default: Date.now 
    },
    customizations: [{
        customizationName: { type: String },
        customizationDesc: { type: String }
    }]
}, {
    timestamps: true // Automatically generates createdAt and updatedAt fields for each record modification
});
