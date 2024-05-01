const userInventorySchema = new Schema({
    userId: { 
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
    condition: { 
        type: String, 
        default: "" 
    }, // Example values: "New", "Used", "Damaged"
    customizations: [{
        customizationName: { type: String },
        customizationDesc: { type: String }
    }]
}, {
    timestamps: true // Automatically generates createdAt and updatedAt fields for each record modification
});
