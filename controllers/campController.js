const Camp = require('../models/Camp');

const getPublicCamps = async (req, res) => {
  try {
    const camps = await Camp.find({ status: 'Published' }).sort({ date: 1 });
    res.json({ success: true, data: camps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getPublicCampById = async (req, res) => {
  try {
    const camp = await Camp.findOne({ _id: req.params.id, status: 'Published' });
    if (!camp) {
      return res.status(404).json({ success: false, message: 'Camp not found' });
    }
    res.json({ success: true, data: camp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const createCamp = async (req, res) => {
  try {
    const camp = new Camp(req.body);
    const createdCamp = await camp.save();
    res.status(201).json({ success: true, data: createdCamp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getAdminCamps = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const camps = await Camp.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Camp.countDocuments(query);

    res.json({
      success: true,
      data: camps,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getAdminCampById = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ success: false, message: 'Camp not found' });
    }
    res.json({ success: true, data: camp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!camp) {
      return res.status(404).json({ success: false, message: 'Camp not found' });
    }
    res.json({ success: true, data: camp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndDelete(req.params.id);
    if (!camp) {
      return res.status(404).json({ success: false, message: 'Camp not found' });
    }
    res.json({ success: true, message: 'Camp removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getPublicCamps,
  getPublicCampById,
  createCamp,
  getAdminCamps,
  getAdminCampById,
  updateCamp,
  deleteCamp
};
