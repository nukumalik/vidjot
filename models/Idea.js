const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const IdeaSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  detail: {
    type: String,
    required: true,
    trim: true
  }
})

IdeaSchema.plugin(timestamp)

module.exports = Idea = mongoose.model('ideas', IdeaSchema)
