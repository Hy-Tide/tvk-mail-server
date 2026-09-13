const Complaint = require('../models/Complaint');
const nodemailer = require('nodemailer');

const sendComplaintEmails = async (complaint) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send to Admin
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      replyTo: complaint.email,
      subject: `New Complaint Submitted: ${complaint.complaintId}`,
      html: `
        <h3>New Complaint Received</h3>
        <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
        <p><strong>Name:</strong> ${complaint.name}</p>
        <p><strong>Mobile:</strong> ${complaint.mobile}</p>
        <p><strong>Email:</strong> ${complaint.email}</p>
        <p><strong>Category:</strong> ${complaint.category}</p>
        <p><strong>Location:</strong> ${complaint.location} (${complaint.address})</p>
        <p><strong>Description:</strong></p>
        <p>${complaint.description}</p>
      `
    });

    // Send to User
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: complaint.email,
      subject: `Complaint Received: ${complaint.complaintId}`,
      html: `
        <h3>Dear ${complaint.name},</h3>
        <p>Your complaint has been successfully received and registered with ID: <strong>${complaint.complaintId}</strong>.</p>
        <p>Our team will look into the issue and get back to you.</p>
        <p><strong>Category:</strong> ${complaint.category}</p>
        <p><strong>Description:</strong> ${complaint.description}</p>
        <br>
        <p>Thank you,</p>
        <p>TVK Complaints Team</p>
      `
    });
  } catch (error) {
    console.error('Failed to send complaint emails:', error);
  }
};

const createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    const createdComplaint = await complaint.save();
    
    // Trigger emails asynchronously (don't block the response)
    sendComplaintEmails(createdComplaint);

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: {
        complaintId: createdComplaint.complaintId,
        status: createdComplaint.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const query = { deletedAt: { $exists: false } };
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      data: complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, deletedAt: { $exists: false } });
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, data: complaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status, description } = req.body;
    const complaint = await Complaint.findOne({ _id: req.params.id, deletedAt: { $exists: false } });
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = status;
    if (description) {
      complaint.statusDescription = description;
    }

    const updatedComplaint = await complaint.save();
    res.json({ success: true, data: updatedComplaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Deletion reason is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.deletedAt = new Date();
    complaint.deletedBy = req.admin._id;
    complaint.deletionReason = reason;

    await complaint.save();

    res.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const trackComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    
    // Find complaint by its readable ID (e.g., TVK-2026-00001)
    const complaint = await Complaint.findOne({ 
      complaintId: new RegExp(`^${complaintId}$`, 'i'), 
      deletedAt: { $exists: false } 
    });
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Return the data mapped to exactly what ComplaintStatus.jsx expects
    res.json({
      success: true,
      data: {
        ticketId: complaint.complaintId,
        name: complaint.name,
        createdAt: complaint.createdAt,
        subject: [complaint.category],
        address: complaint.address,
        status: complaint.status.toLowerCase().replace(' ', ''),
        details: complaint.description
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  trackComplaint
};
