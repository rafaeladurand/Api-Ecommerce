const clientSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }],
    },
    { timestamps: true }
  );
  
  const Client = mongoose.model('Client', clientSchema);
  module.exports = Client;