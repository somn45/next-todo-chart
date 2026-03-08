export const mockCollection = {
  insertOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

const mockDB = {
  collection: jest.fn().mockReturnValue(mockCollection),
};

const connectDB = Promise.resolve({
  db: jest.fn().mockReturnValue(mockDB),
});

export { connectDB };
