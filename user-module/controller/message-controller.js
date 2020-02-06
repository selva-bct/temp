import { logger } from '../config/logger'
import { ResponseService } from '../service'
import { defaultMessage } from '../constant/constant'
import { Message } from '../models/message'

class MessageController {
  constructor () {
    this.responseService = new ResponseService()
  }

  async addMessage (req, res) {
    try {
      logger.info('Adding new message')
      const message = req.body
      if (!message) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      const data = await Message.create(message)
      logger.info('Created message successfully')
      this.responseService.onSuccess(res, 'Created message successfully', data)
    } catch (error) {
      logger.error(error, 'Error while creating message')
      this.responseService.onError(res, error)
    }
  }

  async updateMessage (req, res) {
    try {
      logger.info('Updating message status')
      const message = req.body

      if (!message) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      // some error is coming due to conversation_conversation_id
      const messageInfo = await Message.findOne({ where: { msgId: message.msgId } })
      if (!messageInfo) {
        return this.responseService.onError(res, defaultMessage.NOT_FOUND)
      }
      await Message.update(message, { where: { msgId: message.msgId } })
      logger.info('Message updated successfully')
      this.responseService.onSuccess(res, 'Message updated successfully')
    } catch (error) {
      logger.error(error, 'Error while updating message')
      this.responseService.onError(res, error)
    }
  }

  async getMessageCount (req, res) {
    try {
      logger.info('Getting messages count ')
      const { id } = req.params
      const data = await Message.count({ where: { userId: id } })
      logger.info('Successfully fetched messages count')
      this.responseService.onSuccess(res, 'Successfully fetched messages count', data)
    } catch (error) {
      logger.error(error, 'Error while getting message count')
      this.responseService.onError(res, error)
    }
  }
}

module.exports = MessageController
