// in this model we can keep future and manage schedule scanning for user! 

const mongoose = require("mongoose");
const { Schema } = mongoose;

const scanScheduleSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  scheduledDateTime: { type: Date, required: true },
});

module.exports = mongoose.model("ScanSchedule", scanScheduleSchema);
