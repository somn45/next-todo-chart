export interface IMockDatabase {
  mockCollection: {
    findOne: jest.Mock;
    findOneAndUpdate: jest.Mock;
    insertOne: jest.Mock;
    updateOne: jest.Mock;
    deleteOne: jest.Mock;
    aggregate: () => {
      next: jest.Mock;
      toArray: jest.Mock;
    };
  };
}

export const mockCollection = {
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  aggregate: jest.fn().mockReturnValue({
    next: jest.fn(),
    toArray: jest.fn(),
  }),
};

const mockDB = {
  collection: jest.fn().mockReturnValue(mockCollection),
};

const connectDB = Promise.resolve({
  db: jest.fn().mockReturnValue(mockDB),
});

export { connectDB };
