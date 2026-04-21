const supabase = require('../config/supabase');

exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, first_name, last_name, is_verified, created_at, updated_at')
      .eq('username', username)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Resource not found', data: 'User not found', status: 'BAD_REQUEST' });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      data: {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        isVerified: data.is_verified,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      },
      status: 'OK'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, first_name, last_name, is_verified, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Resource not found', data: 'User not found', status: 'BAD_REQUEST' });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      data: {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        isVerified: data.is_verified,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      },
      status: 'OK'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.getUserConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('user_config')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.status(200).json({
      message: 'Mail config retrieved successfully',
      data: data ? {
        userId: data.user_id,
        autoArchive: data.auto_archive,
        autoReply: data.auto_reply,
        autoReplyMessage: data.auto_reply_message,
        encryptionEnabled: data.encryption_enabled,
        signatureEnabled: data.signature_enabled,
        signature: data.signature,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } : {},
      status: 'OK'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.updateUserConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      auto_archive: req.body.autoArchive,
      auto_reply: req.body.autoReply,
      auto_reply_message: req.body.autoReplyMessage,
      encryption_enabled: req.body.encryptionEnabled,
      signature_enabled: req.body.signatureEnabled,
      signature: req.body.signature,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase
      .from('user_config')
      .update(updates)
      .eq('user_id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: 'Mail config updated successfully',
      data: {
        userId: data.user_id,
        autoArchive: data.auto_archive,
        autoReply: data.auto_reply,
        autoReplyMessage: data.auto_reply_message,
        encryptionEnabled: data.encryption_enabled,
        signatureEnabled: data.signature_enabled,
        signature: data.signature,
      },
      status: 'OK'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('users').delete().eq('id', id);
    res.status(200).json({ message: 'User deactivated successfully', data: {}, status: 'OK' });
  } catch (err) {
    res.status(500).json({ message: 'Error', data: err.message, status: 'INTERNAL_SERVER_ERROR' });
  }
};
