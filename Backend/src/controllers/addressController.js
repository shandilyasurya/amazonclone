const asyncHandler = require('../middleware/asyncHandler');
const { Address } = require('../models/Index');

const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.findAll({
    where: { user_id: req.user.id },
    order: [['id', 'DESC']]
  });
  res.json({ success: true, data: addresses });
});

const addAddress = asyncHandler(async (req, res) => {
  const address = await Address.create({
    user_id: req.user.id,
    ...req.body
  });
  res.status(201).json({ success: true, data: address });
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    where: { id: req.params.id, user_id: req.user.id }
  });

  if (address) {
    const updatedAddress = await address.update(req.body);
    res.json({ success: true, data: updatedAddress });
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

const deleteAddress = asyncHandler(async (req, res) => {
  const deletedCount = await Address.destroy({
    where: { id: req.params.id, user_id: req.user.id }
  });

  if (deletedCount) {
    res.json({ success: true, message: 'Address removed' });
  } else {
    res.status(404);
    throw new Error('Address not found');
  }
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
