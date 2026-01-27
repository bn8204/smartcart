const userRepo = require('../repositories/user.repository');

exports.registerUser = async (userData) => {
  return await userRepo.create(userData);
};

exports.loginUser = async (loginData) => {
  const user = await userRepo.findByEmail(loginData.email);
  if (!user) throw new Error('User not found');
  return 'token_generated';
};