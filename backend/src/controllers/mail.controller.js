const supabase = require('../config/supabase');
const crypto = require('crypto');
const sse = require('./sse.controller');

exports.ingestMail = async (req, res) => {
  res.status(202).json({ message: 'Email ingested successfully', data: '', status: 'ACCEPTED' });
};

exports.getInbox = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // First, get the user's email address
    const { data: user } = await supabase.from('users').select('username').eq('id', userId).single();
    const emailAddress = `${user.username}@mailforge.com`;

    const { data, error } = await supabase
      .from('mails')
      .select('id, from_address, to_address, subject, is_read, received_at')
      .eq('to_address', emailAddress)
      .order('received_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      message: 'Inbox retrieved successfully',
      data: {
        content: data.map(m => ({
          id: m.id,
          fromAddress: m.from_address,
          toAddress: m.to_address,
          subject: m.subject,
          isRead: m.is_read,
          receivedAt: m.received_at
        })),
        totalElements: data.length,
        totalPages: 1,
        number: 0
      },
      status: 'OK'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.getSentItems = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data: user } = await supabase.from('users').select('username').eq('id', userId).single();
    const emailAddress = `${user.username}@mailforge.com`;

    const { data, error } = await supabase
      .from('mails')
      .select('id, from_address, to_address, subject, is_read, received_at')
      .eq('from_address', emailAddress)
      .order('received_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      message: 'Sent items retrieved successfully',
      data: {
        content: data.map(m => ({
          id: m.id,
          fromAddress: m.from_address,
          toAddress: m.to_address,
          subject: m.subject,
          isRead: m.is_read,
          receivedAt: m.received_at
        })),
        totalElements: data.length,
        totalPages: 1,
        number: 0
      },
      status: 'OK'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.sendMail = async (req, res) => {
  try {
    const { fromAddress, toAddress, subject, body, isHTML, attachments } = req.body;

    const rawDataToHash = fromAddress + toAddress + subject + body;
    const hash = crypto.createHash('sha256').update(rawDataToHash).digest('hex');

    const { data, error } = await supabase
      .from('mails')
      .insert([{
        from_address: fromAddress,
        to_address: toAddress,
        subject,
        body,
        is_html: isHTML || false,
        hash
      }])
      .select()
      .single();

    if (error) throw error;

    // Send SSE event if recipient is connected
    // Look up the recipient user ID
    const username = toAddress.split('@')[0];
    const { data: recipientUser } = await supabase.from('users').select('id').eq('username', username).single();
    if (recipientUser) {
      sse.emitToUser(recipientUser.id, 'mail_received', {
        from: fromAddress,
        subject: subject
      });
    }

    res.status(201).json({
      message: 'Mail sent successfully',
      data: { id: data.id },
      status: 'CREATED'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.getEmailById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('mails')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Resource not found', data: 'Mail not found', status: 'BAD_REQUEST' });
    }

    res.status(200).json({
      message: 'Mail retrieved successfully',
      data: {
        id: data.id,
        fromAddress: data.from_address,
        toAddress: data.to_address,
        subject: data.subject,
        body: data.body,
        isHtml: data.is_html,
        isRead: data.is_read,
        hash: data.hash,
        receivedAt: data.received_at
      },
      status: 'OK'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('mails').delete().eq('id', id);
    res.status(200).json({ message: 'Mail deleted successfully', data: '', status: 'OK' });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('mails').update({ is_read: true }).eq('id', id);
    res.status(200).json({ message: 'Mail marked as read', data: '', status: 'OK' });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.verifyIntegrity = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('mails')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Resource not found', data: 'Mail not found', status: 'BAD_REQUEST' });
    }

    const rawDataToHash = data.from_address + data.to_address + data.subject + data.body;
    const computedHash = crypto.createHash('sha256').update(rawDataToHash).digest('hex');
    const isVerified = computedHash === data.hash;

    res.status(200).json({
      message: 'Integrity verified',
      data: { isVerified },
      status: 'OK'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};
