import { dbContext } from "../db/DbContext"
import { BadRequest } from "../utils/Errors"


class TaskService {
  async getAll(userEmail) {
    return await dbContext.Tasks.find({ creatorEmail: userEmail }).populate("creator", "name picture")
  }

  async getById(id, userEmail) {
    let data = await dbContext.Tasks.findOne({ _id: id, creatorEmail: userEmail })
    if (!data) {
      throw new BadRequest("Invalid ID or you do not own this task")
    }
    return data
  }
  async getByListId(id) {
    let data = await dbContext.Tasks.find({ listId: id });
    if (!data) {
      throw new BadRequest("Invalid ID or you do not own this list")
    }
    return data
  }

  async create(rawData) {
    let data = await dbContext.Tasks.create(rawData)
    return data
  }

  async edit(id, userEmail, update) {
    let data = await dbContext.Tasks.findOneAndUpdate({ _id: id, creatorEmail: userEmail }, update, { new: true })
    if (!data) {
      throw new BadRequest("Invalid ID or you do not own this task");
    }
    return data;
  }

  async delete(id, userEmail) {
    let data = await dbContext.Tasks.findOneAndRemove({ _id: id, creatorEmail: userEmail });
    if (!data) {
      throw new BadRequest("Invalid ID or you do not own this task");
    }
  }

  async addComment(id, body) {
    return await dbContext.Tasks.findOneAndUpdate({ _id: id }, { $addToSet: { comments: body } }, { new: true })
  }

  async deleteComment(id, commentId) {
    return await dbContext.Tasks.findOneAndUpdate({ _id: id }, { $pull: { comments: { _id: commentId } } }, { new: true })
  }

}


export const taskService = new TaskService()