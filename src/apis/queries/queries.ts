export const matchUserId = (userid: string) => ({
  $match: {
    author: userid,
  },
});

export const lookupTodoDocument = () => ({
  $lookup: {
    from: "todo",
    localField: "content",
    foreignField: "_id",
    as: "content",
  },
});

export const unwindContent = () => ({
  $unwind: {
    path: "$content",
  },
});

export const matchCreatedAtInCompltedAt = () => {
  const gracePeriod = new Date(Date.now());

  return {
    $match: {
      $or: [
        {
          $or: [{ "content.state": "할 일" }, { "content.state": "진행 중" }],
        },
        {
          $and: [
            { "content.state": "완료" },
            { "content.completedAt": { $gte: gracePeriod } },
          ],
        },
      ],
    },
  };
};

export const toStringMongoDBObjectId = () => ({
  $set: {
    _id: { $toString: "$_id" },
  },
});
