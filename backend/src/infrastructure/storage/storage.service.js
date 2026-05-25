'use strict';

const supabase = require('../../infrastructure/supabase/client');

/**
 * StorageService — wraps Supabase Storage for avatar and prescription uploads.
 */
class StorageService {
  async uploadAvatar(userId, fileBuffer, mimeType, originalFilename) {
    const ext = originalFilename.split('.').pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, fileBuffer, { contentType: mimeType, upsert: true });
    if (error) {
      const err = new Error(`Avatar upload failed: ${error.message}`);
      err.status = 500;
      throw err;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return { storagePath: path, publicUrl: data.publicUrl };
  }

  async uploadPrescription(userId, fileBuffer, mimeType, originalFilename) {
    const ext = originalFilename.split('.').pop();
    const timestamp = Date.now();
    const path = `${userId}/${timestamp}-${originalFilename}`;
    const { error } = await supabase.storage
      .from('prescriptions')
      .upload(path, fileBuffer, { contentType: mimeType });
    if (error) {
      const err = new Error(`Prescription upload failed: ${error.message}`);
      err.status = 500;
      throw err;
    }
    const { data: signedData, error: signError } = await supabase.storage
      .from('prescriptions')
      .createSignedUrl(path, 60 * 60 * 24 * 365);
    return {
      storagePath: path,
      publicUrl: signError ? null : signedData.signedUrl,
      filename: `${timestamp}-${originalFilename}`,
      originalName: originalFilename,
    };
  }

  async deleteFile(bucket, storagePath) {
    const { error } = await supabase.storage.from(bucket).remove([storagePath]);
    if (error) console.warn(`Storage delete warning [${bucket}/${storagePath}]:`, error.message);
  }
}

module.exports = new StorageService();
